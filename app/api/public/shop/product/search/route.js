import Product from "@/models/Product";
import { connectDB } from "@/connections/connect db";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await connectDB();
    const { searchQuery } = await request.json();
    const query = decodeURIComponent(searchQuery);
    const productList = await Product.find();

const normalizedQuery = query.toLowerCase().trim();

const result = productList
  .map((product) => {
    const name = product.name.toLowerCase();

    let score = 0;

    // Exact match gets highest priority
    if (name === normalizedQuery) {
      score = 100;
    }
    // Starts with query
    else if (name.startsWith(normalizedQuery)) {
      score = 75;
    }
    // Includes query
    else if (name.includes(normalizedQuery)) {
      score = 50;
    }
    // Partial word similarity
    else {
      const queryWords = normalizedQuery.split(" ");
      const nameWords = name.split(" ");

      const matchedWords = queryWords.filter((word) =>
        nameWords.some((nw) => nw.includes(word)),
      ).length;

      score = matchedWords * 10;
    }

    return { product, score };
  })
  .filter((item) => item.score > 0)
  .sort((a, b) => b.score - a.score)
  .map((item) => item.product);

    return NextResponse.json({
      success: true,
      result,
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
