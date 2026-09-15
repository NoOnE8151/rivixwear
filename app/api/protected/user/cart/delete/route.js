import { NextResponse } from "next/server";
import Cart from "@/models/Cart";
import { connectDB } from "@/connections/connect db";
import { auth } from "@clerk/nextjs/server";

export async function POST(request) {
  try {
    const { productId } = await request.json(); // id of a specific produtct object to delete
    await connectDB();
    const { userId } = await auth();

    const updatedCart = await Cart.updateOne(
      { userId: userId },
      { $pull: { products: { productId: productId } } },
    );

    return NextResponse.json({
      success: true,
      message: "successfully removed the selected item from user's cart",
      updatedCart
    }, {
      status: 200
    })
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        success: false,
        messaage: "internal server error",
      },
      {
        status: 500,
      },
    );
  }
}
