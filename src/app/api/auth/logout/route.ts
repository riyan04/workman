
import { cookies } from "next/headers";
import { NextResponse } from "next/server";


export async function POST() {

    
    const session = (await cookies()).get("workman-session")
    
    if (!session) {
        return NextResponse.json({ error: "unauthorized" })
    }
  
    

    (await cookies()).delete("workman-session");



    return NextResponse.json({ success: true, message: "successfully logged out" })
}
