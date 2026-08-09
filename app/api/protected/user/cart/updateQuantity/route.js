import { NextResponse } from "next/server";
import { connectDB } from "@/connections/connect db";
import Cart from "@/models/Cart";

export async function POST(request) {
  try {
    await connectDB();

    const { productId, variantId, size, quantity } = await request.json();

    if (!productId || !variantId || !size || quantity === undefined) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields",
        },
        {
          status: 400,
        },
      );
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid quantity",
        },
        {
          status: 400,
        },
      );
    }

    const updatedCart = await Cart.findOneAndUpdate(
      {
        "products.productId": productId,
        "products.variantId": variantId,
        "products.size": size,
      },
      {
        $set: {
          "products.$.quantity": quantity,
        },
      },
    );

    if (!updatedCart) {
      return NextResponse.json(
        {
          success: false,
          message: "Cart item not found",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Successfully updated quantity",
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("Update cart quantity error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      {
        status: 500,
      },
    );
  }
}