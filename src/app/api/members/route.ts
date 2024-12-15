import { getUserProperties } from "@/features/auth/actions";
import { getMember } from "@/features/members/utils";
import { createAdminClient } from "@/lib/appwrite";
import { NextRequest, NextResponse } from "next/server";
import { Models, Query } from "node-appwrite";

export async function GET(request: NextRequest){
    console.log("inside GET function")
    const {users} = await createAdminClient()

    const userHeader = request.headers.get("user")
    const userProperties = await getUserProperties()
    
    if(!userProperties){
        return NextResponse.json({error: "Unable to get userProperties: ./api/members: GET"}, {status: 501})
    }
    const databases = userProperties.databases
    const user: Models.User<Models.Preferences> = JSON.parse(userHeader!);
    // const {workspaceId} = await request.json()
    const workspaceId = request.nextUrl.searchParams.get("workspaceId")
    if(!workspaceId){
        return NextResponse.json({error: "Unable to get workspaceId: ./api/members: GET"}, {status: 501})
    }
    console.log("inside GET: ")

    const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id
    });

    if(!member){
        return NextResponse.json({error: "Cannot get member: ./api/members: GET"}, {status: 401})
    }

    const members = await databases.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_MEMBERS_ID!,
        [
            Query.equal("workspaceId", workspaceId)
        ]
    )

    const populatedMembers = await Promise.all(
        members.documents.map(async(member) => {
            const user = await users.get(member.userId)

            return {
                ...member,
                name: user.name,
                email: user.email
            }
        })
    )
    return NextResponse.json({
        data: {
            ...members,
            documents: populatedMembers
        }
    })



    // return NextResponse.json({message: "hi members"})

}

