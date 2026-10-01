import { NextResponse } from "next/server";
import razorpay from "@/utils/payment/instance";
import { auth } from "@clerk/nextjs/server";
import Cart from "@/models/Cart";
import { connectDB } from "@/connections/connect db";

export async function POST() {
    try {
        await connectDB();
        const { userId } = await auth();
        
        //check if user is authenticated
        if(!userId) {
            return NextResponse.json({
                success: false,
                message: "unauthorized"
            }, {
                status: 401
            })
        }
        
        //fetching user's cart
        const cart = await Cart.findOne({ userId });
        const cartItems = cart.products;
        console.log('cartitems are: ', cartItems)

        //calculating total cost
        const totalCostInRupees = cartItems.reduce((sum, item) => sum + item.price, 0);
        const totalCostInPaise = totalCostInRupees * 100; //razorpay only accepts amount in paise

        //creating the order
        const order = await razorpay.orders.create({
            amount: totalCostInPaise,
            currency: 'INR'
        })

        console.log('successfully created order', order);

        return NextResponse.json({
            success: true,
            message: 'successfully created order',
            order
        })
    } catch (error) {
        console.log(error);
        return NextResponse.json({
            success: false,
            message: "internal server error"
        })
    }
}