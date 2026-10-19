import { NextResponse } from "next/server";
import Order from "@/models/Order";
import { connectDB } from "@/connections/connect db";
import { auth } from "@clerk/nextjs/server";

const allowedStatuses = [
  "pending",
  "active",
  "accepted",
  "fulfilled",
  "cancelled",
];

export async function PATCH(request) {
  try {
    // Authenticate user
    const { sessionClaims, userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    // Check admin role
    const userRole = sessionClaims?.metadata?.role;

    if (userRole !== "admin") {
      return NextResponse.json(
        {
          success: false,
          message: "Forbidden",
        },
        { status: 403 }
      );
    }

    // Get request body
    const body = await request.json();

    const { orderId, status } = body;

    // Validate order ID
    if (!orderId) {
      return NextResponse.json(
        {
          success: false,
          message: "Order ID is required",
        },
        { status: 400 }
      );
    }

    // Validate status
    if (!status || !allowedStatuses.includes(status)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid order status",
        },
        { status: 400 }
      );
    }

    // Connect database
    await connectDB();

    // Find order
    const order = await Order.findById(orderId);

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          message: "Order not found",
        },
        { status: 404 }
      );
    }

    // Don't allow changes to completed/cancelled orders
    if (
      order.status === "fulfilled" ||
      order.status === "cancelled"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: `Cannot update an ${order.status} order`,
        },
        { status: 400 }
      );
    }

    // Update status
    order.status = status;

    await order.save();

    return NextResponse.json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error(
      "PATCH /api/admin/orders/updateStatus error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}