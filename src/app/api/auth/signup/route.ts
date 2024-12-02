import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest){
    const {name, email, password} = await request.json()
    return NextResponse.json({name, email, password});
}