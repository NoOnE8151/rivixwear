import { NextResponse } from "next/server";
import { connectDB } from "@/connections/connect db";
import Cart from "@/models/Cart";
import Product from "@/models/Product";
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
        }
      );
    }

    const cart = await Cart.findOne({ userId: user.id });

    if (!cart || cart.products.length === 0) {
      return NextResponse.json({
        success: true,
        cart: [],
      });
    }

    // Get all product ids from cart
    const productIds = cart.products.map((item) => item.productId);

    // Fetch all products in one query
    const products = await Product.find({
      _id: { $in: productIds },
    });

    // Create lookup map
    const productMap = new Map(
      products.map((product) => [product._id.toString(), product])
    );

    // Build frontend response
    const finalCart = cart.products
      .map((item) => {
        const product = productMap.get(item.productId.toString());

        if (!product) return null;

        const variant = product.variants.find(
          (v) => v.id === item.variantId
        );

        if (!variant) return null;

        return {
          id: product._id.toString(),
          variantId: variant.id,
          name: product.name,
          variant: variant.name,
          size: item.size,
          price: item.price,
          qty: item.quantity,
          image: variant.images[0],
        };
      })
      .filter(Boolean);

    return NextResponse.json({
      success: true,
      cart: finalCart,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}