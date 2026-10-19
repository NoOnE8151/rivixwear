import { NextResponse } from "next/server";
import { connectDB } from "@/connections/connect db";
import Order from "@/models/Order";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    await connectDB();
    const orders = await Order.find({ userId });
    return NextResponse.json(
      {
        success: true,
        message: "successfully fetched orders for this user",
        orders,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        success: false,
        message: "internal server error",
      },
      {
        status: 500,
      },
    );
  }
}
