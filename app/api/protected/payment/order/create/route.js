
import { NextResponse } from "next/server";
import razorpay from "@/utils/payment/instance";
import { auth } from "@clerk/nextjs/server";
import Cart from "@/models/Cart";
import { connectDB } from "@/connections/connect db";

export async function POST() {
  try {
    await connectDB();

    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Fetch user's cart
    const cart = await Cart.findOne({ userId });

    if (!cart || cart.products.length === 0) {
      return NextResponse.json(
        { success: false, message: "Your cart is empty" },
        { status: 400 }
      );
    }

    const cartItems = cart.products;

    // Calculate total including quantities
    const totalCostInRupees = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const totalCostInPaise = Math.round(totalCostInRupees * 100);

    if (totalCostInPaise <= 0) {
      return NextResponse.json(
        { success: false, message: "Invalid order amount" },
        { status: 400 }
      );
    }

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: totalCostInPaise,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    return NextResponse.json({
      success: true,
      message: "Successfully created order",
      order,
    });

  } catch (error) {
    console.error("Razorpay order creation error:", error);

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
