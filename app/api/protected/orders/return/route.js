import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { auth } from "@clerk/nextjs/server";

import { connectDB } from "@/connections/connect db";
import Order from "@/models/Order";

const RETURN_WINDOW_MS = 5 * 24 * 60 * 60 * 1000;

const VALID_REASONS = [
  "Damaged or defective",
  "Wrong product received",
  "Size or fit issue",
  "Product quality issue",
  "Item not as described",
  "Other",
];

export async function POST(request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Please sign in to request a return.",
        },
        { status: 401 }
      );
    }

    let body;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid request body." },
        { status: 400 }
      );
    }

    const { orderId, productItemId, reasonCategory, reasonDetails } =
      body || {};

    if (
      !mongoose.Types.ObjectId.isValid(orderId) ||
      !mongoose.Types.ObjectId.isValid(productItemId)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid order or product reference.",
        },
        { status: 400 }
      );
    }

    if (!VALID_REASONS.includes(reasonCategory)) {
      return NextResponse.json(
        {
          success: false,
          message: "Please select a valid return reason.",
        },
        { status: 400 }
      );
    }

    const cleanDetails =
      typeof reasonDetails === "string" ? reasonDetails.trim() : "";

    if (cleanDetails.length < 15 || cleanDetails.length > 1000) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please provide at least 15 characters explaining the reason for your return.",
        },
        { status: 400 }
      );
    }

    await connectDB();

    const order = await Order.findOne({
      _id: orderId,
      userId,
    });

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found." },
        { status: 404 }
      );
    }

    // Returns are accepted only for fulfilled orders.
    if (order.status !== "fulfilled") {
      return NextResponse.json(
        {
          success: false,
          message: "Only fulfilled orders are eligible for return.",
        },
        { status: 400 }
      );
    }

    const now = Date.now();
    const fulfilledTime = order.fulfilledAt
      ? new Date(order.fulfilledAt).getTime()
      : NaN;

    // Older orders without a recorded fulfillment date cannot
    // have their return eligibility reliably determined.
    if (!Number.isFinite(fulfilledTime)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "The fulfillment date is unavailable for this order. Please contact support.",
        },
        { status: 400 }
      );
    }

    // Five-day return window starts from fulfillment.
    if (
      now < fulfilledTime ||
      now >= fulfilledTime + RETURN_WINDOW_MS
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "The five-day return window for this order has expired.",
        },
        { status: 400 }
      );
    }

    const productItem = order.products.id(productItemId);

    if (!productItem) {
      return NextResponse.json(
        { success: false, message: "Product not found in this order." },
        { status: 404 }
      );
    }

    const currentReturnStatus =
      productItem.returnRequest?.status || "not_requested";

    if (currentReturnStatus !== "not_requested") {
      return NextResponse.json(
        {
          success: false,
          message: "A return request already exists for this product.",
        },
        { status: 409 }
      );
    }

    // Atomic update: verify ownership, fulfillment date,
    // return window and product eligibility together.
    const updatedOrder = await Order.findOneAndUpdate(
      {
        _id: orderId,
        userId,
        status: "fulfilled",
        fulfilledAt: {
          $gt: new Date(now - RETURN_WINDOW_MS),
          $lte: new Date(now),
        },
        products: {
          $elemMatch: {
            _id: new mongoose.Types.ObjectId(productItemId),
            $or: [
              { "returnRequest.status": "not_requested" },
              { "returnRequest.status": { $exists: false } },
              { "returnRequest.status": null },
            ],
          },
        },
      },
      {
        $set: {
          "products.$.returnRequest": {
            status: "requested",
            reasonCategory,
            reasonDetails: cleanDetails,
            requestedAt: new Date(now),
          },
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedOrder) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This product's return request has already been submitted, or the return window has expired.",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Your return request has been submitted successfully.",
        order: updatedOrder.toObject(),
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Return request error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "An internal server error occurred.",
      },
      { status: 500 }
    );
  }
}