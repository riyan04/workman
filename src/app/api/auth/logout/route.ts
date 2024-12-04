
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { Account } from "node-appwrite";


export async function POST(request: NextRequest) {

    // const accountHeader = request.headers.get("account");
    // const accountHeader = request.headers.get("account");

    // if(!accountHeader){
    //     return NextResponse.json({error: "Unauthorized from logout route"}, {status: 401})
    // }
    
    const session = (await cookies()).get("workman-session")
    
    if (!session) {
        return NextResponse.json({ error: "unauthorized" })
    }
    
    // console.log("reached here")
    // const account: Account = await JSON.parse(accountHeader!); 
    

    (await cookies()).delete("workman-session");
    // console.log(account)
    // account.deleteSession("current")

    // console.log(res)


    return NextResponse.json({ success: true, message: "successfully logged out" })
}
