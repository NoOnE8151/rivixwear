import crypto from "crypto";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
      await req.json();

    console.log(
      "frontend recived fields: ",
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
    );

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid payment signature",
        },
        { status: 400 },
      );
    }

    //payment is cryptographically verified here.
    return NextResponse.json({
      success: true,
      message: "Payment verified successfully",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Payment verification failed",
      },
      { status: 500 },
    );
  }
}
