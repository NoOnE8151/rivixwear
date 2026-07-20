import { connectDB } from "@/connections/connect db";
import { NextResponse } from "next/server";
import Product from "@/models/Product";

export async function POST(request) {
    try {
        await connectDB();
        const { collectionName } = await request.json();
        const collection = await Product.find({ collection: collectionName });
        
        if (!collectionName) {
            return NextResponse.json({
                success: false,
                message: 'the field "collectionName" is required'
            }, {
                status: 400
            })
        }

        if (!collection) {
            return NextResponse.json({
                success: false,
                message: `collection named ${collectionName} doesnt exist`
            }, {
                status: 404
            })
        }

        return NextResponse.json({
            success: true,
            collection,
            message: `successfully retrived collection, ${collectionName}`
        }, {
            status: 200
        })
    } catch (error) {
        console.log(error);
        return NextResponse.json({
            success: false,
            message: 'internal server error',
        }, {
            status: 500
        })
    }
}