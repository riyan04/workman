import { NextRequest, NextResponse } from "next/server";

export async function GET (request: NextRequest){
    
    const userHeader = request.headers.get("user")

    const user = JSON.parse(userHeader!);

    return NextResponse.json({data: user})

}