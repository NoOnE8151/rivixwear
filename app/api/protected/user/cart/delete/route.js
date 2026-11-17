
import { NextResponse } from "next/server";
import Cart from "@/models/Cart";
import { connectDB } from "@/connections/connect db";
import { auth } from "@clerk/nextjs/server";
import mongoose from "mongoose";

export async function POST(request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { productId, variantId, size } = await request.json();

    if (!productId || !variantId || !size) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json(
        { success: false, message: "Invalid product ID" },
        { status: 400 }
      );
    }

    await connectDB();

    const updatedCart = await Cart.updateOne(
      { userId },
      {
        $pull: {
          products: {
            productId: new mongoose.Types.ObjectId(productId),
            variantId,
            size,
          },
        },
      }
    );

    return NextResponse.json({
      success: true,
      message: "Selected cart item removed successfully",
      deleted: updatedCart.modifiedCount > 0,
    });

  } catch (error) {
    console.error("Cart deletion error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
