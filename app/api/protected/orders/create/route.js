import { NextResponse } from "next/server";
import { connectDB } from "@/connections/connect db";
import Cart from "@/models/Cart";
import Order from "@/models/Order";
import { auth } from "@clerk/nextjs/server";

export async function POST(request) { 
    try {
        const {paymentMethod} = await request.json();
        const {userId} = await auth(); //get current user's id

        await connectDB();
        const cart = await Cart.findOne({userId}); //get user's cart
        const order = await Order.create({ //create an order
            userId,
            products: [...cart.products],
            status: "pending",
            paymentMethod
        })
       
        //clean the cart once order is created
        await Cart.deleteOne({userId});

        return NextResponse.json({
            success: true,
            message: 'successfully created order',
            order
        })
    } catch (error) {
        console.log(error);
        return NextResponse.json({
            success: false,
            message: 'internal server error'
        })
    }
}