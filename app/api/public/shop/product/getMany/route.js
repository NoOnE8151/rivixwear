import { connectDB } from "@/connections/connect db";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const data = await request.json();
        console.log("data was recived: ", data)

        return NextResponse.json({
            success: true
        })

    } catch(error) {
        console.log(error);
        return NextResponse.json({
            success: false,
            message: 'internal server error'
        },{
            status: 500
        })
    }
}