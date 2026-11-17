import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { connectDB } from "@/connections/connect db";
import Cart from "@/models/Cart";
import Order from "@/models/Order";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\d{10}$/;
const PINCODE_REGEX = /^\d{6}$/;

export async function POST(request) {
  try {
    // Authenticate user
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized.",
        },
        { status: 401 }
      );
    }

    // Parse request body
    let body;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid request body.",
        },
        { status: 400 }
      );
    }

    const paymentMethod = String(body?.paymentMethod || "")
      .trim()
      .toLowerCase();

    const email = String(body?.email || "")
      .trim()
      .toLowerCase();

    // Extract shipping details
    const inputAddress = body?.shippingAddress || {};

    const shippingAddress = {
      firstName: String(inputAddress.firstName || "").trim(),
      lastName: String(inputAddress.lastName || "").trim(),
      phone: String(inputAddress.phone || "").replace(/\D/g, ""),
      address: String(inputAddress.address || "").trim(),
      apartment: String(inputAddress.apartment || "").trim(),
      city: String(inputAddress.city || "").trim(),
      state: String(inputAddress.state || "").trim(),
      pincode: String(
        inputAddress.pincode || inputAddress.pinCode || ""
      ).trim(),
      country: String(inputAddress.country || "India").trim(),
    };

    // Validate email
    if (!EMAIL_REGEX.test(email) || email.length > 254) {
      return NextResponse.json(
        {
          success: false,
          message: "Please provide a valid email address.",
        },
        { status: 400 }
      );
    }

    // Validate payment method
    if (!["cod", "prepaid"].includes(paymentMethod)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid payment method.",
        },
        { status: 400 }
      );
    }

    // Validate required shipping fields
    const requiredAddressFields = [
      shippingAddress.firstName,
      shippingAddress.lastName,
      shippingAddress.phone,
      shippingAddress.address,
      shippingAddress.city,
      shippingAddress.state,
      shippingAddress.pincode,
      shippingAddress.country,
    ];

    if (requiredAddressFields.some((value) => !value)) {
      return NextResponse.json(
        {
          success: false,
          message: "Please provide all required shipping details.",
        },
        { status: 400 }
      );
    }

    // Validate phone number
    if (!PHONE_REGEX.test(shippingAddress.phone)) {
      return NextResponse.json(
        {
          success: false,
          message: "Phone number must contain 10 digits.",
        },
        { status: 400 }
      );
    }

    // Validate PIN code
    if (!PINCODE_REGEX.test(shippingAddress.pincode)) {
      return NextResponse.json(
        {
          success: false,
          message: "PIN code must contain 6 digits.",
        },
        { status: 400 }
      );
    }

    await connectDB();

    // Fetch user's cart
    const cart = await Cart.findOne({ userId });

    if (
      !cart ||
      !Array.isArray(cart.products) ||
      cart.products.length === 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Your cart is empty.",
        },
        { status: 400 }
      );
    }

    // Create order with immutable customer and shipping details
    const order = await Order.create({
      userId,
      email,
      shippingAddress,
      products: [...cart.products],
      status: "pending",
      paymentMethod,
    });

    // Clear cart only after successful order creation
    await Cart.deleteOne({ userId });

    return NextResponse.json(
      {
        success: true,
        message: "Order created successfully.",
        order,
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Order creation failed:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error.",
      },
      { status: 500 }
    );
  }
}