import { NextResponse } from "next/server";
import { connectDB } from "@/connections/connect db";
import Cart from "@/models/Cart";

export async function GET() { 
    try {
        return NextResponse.json({
            success: true,
            message: 'basic response'
        })
    } catch (error) {
        console.log(error);
        return NextResponse.json({
            success: false,
            message: 'internal server error'
        })
    }
}