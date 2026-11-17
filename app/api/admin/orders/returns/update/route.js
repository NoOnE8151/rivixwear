import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { auth } from "@clerk/nextjs/server";

import Order from "@/models/Order";
import { connectDB } from "@/connections/connect db";

const validResolutionTypes = ["refund", "exchange"];

function cleanString(value, maxLength = 1000) {
  return typeof value === "string"
    ? value.trim().slice(0, maxLength)
    : "";
}

function parseOptionalDate(value) {
  if (!value) return null;

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? undefined
    : date;
}

export async function PATCH(request) {
  try {
    const { sessionClaims, userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized." },
        { status: 401 }
      );
    }

    if (sessionClaims?.metadata?.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Access denied." },
        { status: 403 }
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

    const {
      orderId,
      productItemId,
      action,
    } = body;

    if (
      !mongoose.isValidObjectId(orderId) ||
      !mongoose.isValidObjectId(productItemId)
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid order or product item ID." },
        { status: 400 }
      );
    }

    await connectDB();

    const order = await Order.findById(orderId);

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found." },
        { status: 404 }
      );
    }

    const productItem = order.products.id(productItemId);

    if (!productItem) {
      return NextResponse.json(
        { success: false, message: "Product item not found in this order." },
        { status: 404 }
      );
    }

    if (!productItem.returnRequest) {
      return NextResponse.json(
        { success: false, message: "No return request exists for this item." },
        { status: 400 }
      );
    }

    const returnRequest = productItem.returnRequest;
    const note = cleanString(body.adminNote, 1000);
    const now = new Date();

    switch (action) {
      // =====================================
      // APPROVE RETURN
      // =====================================
      case "approve": {
        if (returnRequest.status !== "requested") {
          return NextResponse.json(
            { success: false, message: "Only pending requests can be approved." },
            { status: 409 }
          );
        }

        if (!validResolutionTypes.includes(body.resolutionType)) {
          return NextResponse.json(
            { success: false, message: "Choose refund or exchange." },
            { status: 400 }
          );
        }

        returnRequest.status = "approved";
        returnRequest.resolutionType = body.resolutionType;
        returnRequest.resolutionStatus = "pending";
        returnRequest.reviewedAt = now;
        returnRequest.adminNote = note;

        break;
      }

      // =====================================
      // REJECT RETURN
      // =====================================
      case "reject": {
        if (returnRequest.status !== "requested") {
          return NextResponse.json(
            { success: false, message: "Only pending requests can be rejected." },
            { status: 409 }
          );
        }

        if (note.length < 5) {
          return NextResponse.json(
            { success: false, message: "Provide a clear rejection reason." },
            { status: 400 }
          );
        }

        returnRequest.status = "rejected";
        returnRequest.reviewedAt = now;
        returnRequest.adminNote = note;

        break;
      }

      // =====================================
      // SCHEDULE REVERSE PICKUP
      // =====================================
      case "schedule_pickup": {
        if (returnRequest.status !== "approved") {
          return NextResponse.json(
            { success: false, message: "Approve the return before scheduling pickup." },
            { status: 409 }
          );
        }

        const courier = cleanString(body.pickupCourier, 100);
        const trackingNumber = cleanString(body.pickupTrackingNumber, 120);
        const scheduledAt = parseOptionalDate(body.pickupScheduledAt);

        if (!courier || !trackingNumber) {
          return NextResponse.json(
            { success: false, message: "Courier and tracking number are required." },
            { status: 400 }
          );
        }

        if (scheduledAt === undefined) {
          return NextResponse.json(
            { success: false, message: "Invalid pickup date." },
            { status: 400 }
          );
        }

        returnRequest.pickupCourier = courier;
        returnRequest.pickupTrackingNumber = trackingNumber;
        returnRequest.pickupScheduledAt = scheduledAt;
        returnRequest.pickupStatus = "scheduled";

        break;
      }

      // =====================================
      // MARK PICKED UP
      // =====================================
      case "mark_picked_up": {
        if (
          returnRequest.status !== "approved" ||
          returnRequest.pickupStatus !== "scheduled"
        ) {
          return NextResponse.json(
            { success: false, message: "Schedule the pickup before marking it collected." },
            { status: 409 }
          );
        }

        returnRequest.pickupStatus = "picked_up";
        returnRequest.pickedUpAt = now;

        break;
      }

      // =====================================
      // MARK ITEM RECEIVED
      // =====================================
      case "mark_received": {
        if (returnRequest.status !== "approved") {
          return NextResponse.json(
            { success: false, message: "Only approved returns can be marked received." },
            { status: 409 }
          );
        }

        returnRequest.status = "received";
        returnRequest.receivedAt = now;

        break;
      }

      // =====================================
      // START REFUND / EXCHANGE PROCESSING
      // =====================================
      case "start_resolution": {
        if (
          returnRequest.status !== "received" ||
          returnRequest.resolutionStatus !== "pending"
        ) {
          return NextResponse.json(
            { success: false, message: "This return is not ready for resolution." },
            { status: 409 }
          );
        }

        returnRequest.resolutionStatus = "processing";

        break;
      }

      // =====================================
      // COMPLETE REFUND / EXCHANGE
      // =====================================
      case "complete_resolution": {
        if (
          returnRequest.status !== "received" ||
          returnRequest.resolutionStatus !== "processing"
        ) {
          return NextResponse.json(
            { success: false, message: "Start resolution processing before completing it." },
            { status: 409 }
          );
        }

        const reference = cleanString(body.resolutionReference, 120);
        const resolutionNote = cleanString(body.resolutionNote, 1000);

        if (!reference) {
          return NextResponse.json(
            {
              success: false,
              message: "A transaction or replacement reference is required.",
            },
            { status: 400 }
          );
        }

        if (returnRequest.resolutionType === "refund") {
          const amount = Number(body.resolutionAmount);
          const maximumAmount =
            Number(productItem.price || 0) *
            Number(productItem.quantity || 0);

          if (
            !Number.isFinite(amount) ||
            amount <= 0 ||
            amount > maximumAmount
          ) {
            return NextResponse.json(
              {
                success: false,
                message: `Enter a valid refund amount up to ₹${maximumAmount}.`,
              },
              { status: 400 }
            );
          }

          returnRequest.resolutionAmount = amount;
        }

        returnRequest.resolutionReference = reference;
        returnRequest.resolutionNote = resolutionNote;
        returnRequest.resolutionStatus = "completed";
        returnRequest.status = "completed";
        returnRequest.completedAt = now;

        break;
      }

      default:
        return NextResponse.json(
          { success: false, message: "Unsupported return action." },
          { status: 400 }
        );
    }

    order.markModified("products");

    await order.save();

    return NextResponse.json({
      success: true,
      message: "Return updated successfully.",
      order,
    });
  } catch (error) {
    console.error("Admin return update error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to update the return request.",
      },
      { status: 500 }
    );
  }
}