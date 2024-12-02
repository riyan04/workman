
import { NextRequest, NextResponse } from "next/server";




export async function POST(
    request: NextRequest
){
    const {email, password} = await request.json()
    console.log({email, password})
    return NextResponse.json({email, password})
}