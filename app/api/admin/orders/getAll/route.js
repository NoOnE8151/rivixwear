import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import Order from "@/models/Order";
import { connectDB } from "@/connections/connect db";

export async function GET() {
  try {
    const { userId, sessionClaims } = await auth();

    // Check authentication
    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "unauthorized",
        },
        { status: 401 }
      );
    }

    // Check admin authorization
    if (sessionClaims?.metadata?.role !== "admin") {
      return NextResponse.json(
        {
          success: false,
          message: "forbidden",
        },
        { status: 403 }
      );
    }

    // Fetch all orders
    await connectDB();

    const orders = await Order.find({})
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(
      {
        success: true,
        message: "Successfully fetched all orders.",
        orders,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Admin orders fetch failed:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error.",
      },
      { status: 500 }
    );
  }
}