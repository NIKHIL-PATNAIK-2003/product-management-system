import connectMongoDB from "@/app/libs/mongodb";
import Product from "@/models/products";
import Review from "@/models/reviews";
import { NextResponse } from "next/server";

export async function POST(request){
    const { imageUrl,productName,productDescription,price }=await request.json();
    await connectMongoDB();
    await Product.create({imageUrl,productName,productDescription,price});
    return NextResponse.json({message: "product created sucessfully by nikhil"},{status:201});
}