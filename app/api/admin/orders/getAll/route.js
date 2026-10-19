import { NextResponse } from "next/server";
import Order from "@/models/Order";
import { connectDB } from "@/connections/connect db";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
    try {
        const { sessionClaims, userId } = await auth();
        const userRole = sessionClaims.metadata?.role;
        if(!userId) { //check if user is authenticated
            return NextResponse.json({
                success: false,
                message: 'unauthorized'
            }, {
                status: 401
            })
        } else if(userRole !== "admin") {//reject request if user is not admin
            return NextResponse.json({
                success: false,
                message: "forbbidden"
            }, {
                status: 403
            })
        }

        // send orders 
        await connectDB();
        const orders = await Order.find();
        console.log("logging all orders in server side console", orders);
        return NextResponse.json({
            success: true,
            message: "successfully fetched all orders",
            orders
        })
    } catch (error) {
        console.log(error);
        return NextResponse.json({
            success: false,
            message: "internal server error"
        })
    }
}