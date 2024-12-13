import { getUserProperties } from "@/features/auth/actions";
import { MemberRole } from "@/features/members/types";
import { getMember } from "@/features/members/utils";
import { WorkspaceType } from "@/features/workspaces/types";
import { NextRequest, NextResponse } from "next/server";
import { ID, Models } from "node-appwrite";

interface Params {
    workspaceId: string;
}

export async function POST(request: NextRequest, { params }: { params: Params }) {
    const { workspaceId } = await params
    const { code } = await request.json()
    const userProperties = await getUserProperties()
    if (!userProperties) {
        return NextResponse.json({ error: "Unable to get userProperties: ./api/workspace/[workspaceId]:POST" }, { status: 501 })
    }
    const databases = userProperties.databases
    const userHeader = request.headers.get("user")
    const user: Models.User<Models.Preferences> = JSON.parse(userHeader!);

    const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id
    })

    if(member){
        return NextResponse.json({ error: "Already a member: ./api/workspace/[workspaceId]/join:POST" }, { status: 400 })
    }

    const workspace = await databases.getDocument<WorkspaceType>(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_WORKSPACES_ID!,
        workspaceId
    )
    
    if(workspace.inviteCode !== code){
        return NextResponse.json({ error: "Invalid Invite code: ./api/workspace/[workspaceId]/join:POST" }, { status: 400 })
    }

    await databases.createDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_MEMBERS_ID!,
        ID.unique(),
        {
            workspaceId,
            userId: user.$id,
            role: MemberRole.MEMBER
        }
    )

    return NextResponse.json({data: workspace})
}