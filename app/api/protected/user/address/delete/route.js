import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/connections/connect db";
import Address from "@/models/Address";
import mongoose from "mongoose";

const OBJECT_ID_REGEX = /^[0-9a-fA-F]{24}$/;

export async function DELETE(request) {
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

    const { addressId } = body || {};

    if (
      !addressId ||
      typeof addressId !== "string" ||
      !OBJECT_ID_REGEX.test(addressId)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid address ID.",
        },
        { status: 400 }
      );
    }

    await connectDB();

    // Delete only the selected address belonging to this user.
    const updatedDocument = await Address.findOneAndUpdate(
      {
        userId,
        "addresses._id": new mongoose.Types.ObjectId(addressId),
      },
      {
        $pull: {
          addresses: {
            _id: new mongoose.Types.ObjectId(addressId),
          },
        },
      },
      {
        new: true,
      }
    );

    if (!updatedDocument) {
      return NextResponse.json(
        {
          success: false,
          message: "Address not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Address deleted successfully.",
        savedAddresses: updatedDocument.addresses,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE ADDRESS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error.",
      },
      { status: 500 }
    );
  }
}