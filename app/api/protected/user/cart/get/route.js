import { NextResponse } from "next/server";
import { connectDB } from "@/connections/connect db";
import Cart from "@/models/Cart";
import { currentUser } from "@clerk/nextjs/server";

export async function GET() {
    console.log('request recived')
    const user = await currentUser();
    console.log('retrived user info server side', user.id);
    return NextResponse.json({
        success: true,
    })
}