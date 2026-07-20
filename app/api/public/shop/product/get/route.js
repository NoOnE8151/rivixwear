import { connectDB } from "@/connections/connect db";
import Product from "@/models/Product"
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function POST(request) {
  try {
    await connectDB();
    const { productId } = await request.json();
    let product = await Product.findOne({ _id: productId});
    let message;

    if (!product) {
      product = await Product.find();
      message =
        "counld not find product with provided id, returned all products";
    } else {
      message = "sucessfully fetched specific product";
    }

    return NextResponse.json({
      success: true,
      products: product,
      message,
    });
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
