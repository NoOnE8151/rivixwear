import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/connections/connect db";
import Cart from "@/models/Cart";

export async function POST(request) {
  try {
    await connectDB();

    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const { productId, variantId, size, price } = await request.json();

    if (!productId || !variantId || !size || !price) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields",
        },
        {
          status: 400,
        }
      );
    }

    let cart = await Cart.findOne({ userId });

    // Create cart if it doesn't exist
    if (!cart) {
      cart = await Cart.create({
        userId,
        products: [
          {
            productId,
            variantId,
            size,
            price,
          },
        ],
      });

      return NextResponse.json(
        {
          success: true,
          message: "Product added to cart",
          cart,
        },
        {
          status: 201,
        }
      );
    }

    // Check if same product + variant + size already exists
    const existingItem = cart.products.find(
      (item) =>
        item.productId.toString() === productId &&
        item.variantId === variantId &&
        item.size === size
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.products.push({
        productId,
        variantId,
        size,
        price,
      });
    }

    await cart.save();

    return NextResponse.json({
      success: true,
      message: "Product added to cart",
      cart,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
}