
import { createAdminClient } from "@/lib/appwrite";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";




export async function POST(
    request: NextRequest
){
    const {email, password} = await request.json()
    // console.log({email, password})
    const { account } = await createAdminClient()
    const session = await account.createEmailPasswordSession(email, password);
    (await cookies()).set("workman-session", session.secret, {
        path: "/",
        httpOnly: true,
        sameSite: "strict",
        secure: true,
        maxAge: 60*60*24*30
    })
    return NextResponse.json({success: true})
}