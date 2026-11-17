import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/connections/connect db";
import Address from "@/models/Address";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    await connectDB();

    const addressDocument = await Address.findOne({ userId })
      .select("addresses")
      .lean();

    return NextResponse.json(
      {
        success: true,
        savedAddresses: addressDocument?.addresses || [],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET SAVED ADDRESSES ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error.",
      },
      { status: 500 }
    );
  }
}