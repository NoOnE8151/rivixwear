import { NextResponse } from "next/server";
import { connectDB } from "@/connections/connect db";
import Address from "@/models/Address";
import { currentUser } from "@clerk/nextjs/server";

export async function GET() {
  try {
    await connectDB();
    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    const savedAddresses = await Address.findOne({ userId: user.id });

    if (!savedAddresses) {
      return NextResponse.json({
        success: true,
        savedAddresses: [],
      });
    }
    return NextResponse.json({
      success: true,
      savedAddresses: savedAddresses.addresses,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
      message: "internal server error",
    });
  }
}
