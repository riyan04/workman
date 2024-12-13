import { getUserProperties } from "@/features/auth/actions";
import { MemberRole } from "@/features/members/types";
import { getMember } from "@/features/members/utils";
import { generateInviteCode } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import { Models } from "node-appwrite";

interface Params {
    workspaceId: string;
}

export async function POST(request: NextRequest, {params}: {params: Params}){

    const userProperties = await getUserProperties()
    if(!userProperties){
        return NextResponse.json({ error: "Unable to get userProperties: ./api/workspace/[workspaceId]:DELETE" }, { status: 501 })
    }
    const databases = userProperties.databases
    const userHeader = request.headers.get("user")
    const user: Models.User<Models.Preferences> = JSON.parse(userHeader!);
    const {workspaceId} = await params
    if(!workspaceId){
        return NextResponse.json({ error: "Unable to get workspaceId: ./api/workspace/[workspaceId]:DELETE" }, { status: 501 })
    }
    const member = await getMember({
        databases: databases,
        workspaceId: workspaceId,
        userId: user.$id
    });

    if(!member || member.role !== MemberRole.ADMIN){
        return NextResponse.json({ error: "Unauthorized to update the workspace: ./api/workspace/[workspaceId]:DELETE" }, { status: 401 })
    }


    const workspace = await databases.updateDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_WORKSPACES_ID!,
        workspaceId,
        {
            inviteCode: generateInviteCode(6)
        }
    )

    return NextResponse.json({data: workspace})

}