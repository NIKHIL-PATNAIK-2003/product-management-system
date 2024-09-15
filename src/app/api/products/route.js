import connectMongoDB from "@/app/libs/mongodb";
import Product from "@/models/products";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Connect to the database
    await connectMongoDB();

    // Fetch all products
    const products = await Product.find({});

    // Return the products as a JSON response
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
