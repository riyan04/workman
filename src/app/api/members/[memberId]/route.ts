import { getUserProperties } from "@/features/auth/actions";
import { MemberRole } from "@/features/members/types";
import { getMember } from "@/features/members/utils";
import { NextRequest, NextResponse } from "next/server";
import { Models, Query } from "node-appwrite";

interface Params {
    memberId: string
}

export async function DELETE(
    request: NextRequest, 
    {params}: {params: Promise<Params>}
) {
// export async function DELETE(request: NextRequest, { params }: { params: Params }) {

    const { memberId } = await params
    const userHeader = request.headers.get("user")
    const user: Models.User<Models.Preferences> = JSON.parse(userHeader!);
    const userProperties = await getUserProperties()

    if (!userProperties) {
        return NextResponse.json({ error: "Unable to get userProperties: ./api/members/[memberId]: DELETE" }, { status: 501 })
    }
    const databases = userProperties.databases

    const memberToDelete = await databases.getDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_MEMBERS_ID!,
        memberId
    )

    const allMembersInWorkspace = await databases.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_MEMBERS_ID!,
        [
            Query.equal("workspaceId", memberToDelete.workspaceId)
        ]
    );

    const member = await getMember({
        databases,
        workspaceId: memberToDelete.workspaceId,
        userId: user.$id
    })

    if(!member){
        return NextResponse.json({ error: "Unauthorized to delete members: ./api/members/[memberId]: DELETE" }, { status: 401 })
    }

    if(member.$id !== memberToDelete.$id && member.role !== MemberRole.ADMIN){
        return NextResponse.json({ error: "Unauthorized to delete members; not an Admin: ./api/members/[memberId]: DELETE" }, { status: 401 })
    }
    
    if(allMembersInWorkspace.total === 1){
        return NextResponse.json({ error: "Cannot delete the only member: ./api/members/[memberId]: DELETE" }, { status: 400 })

    }

    await databases.deleteDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_MEMBERS_ID!,
        memberId
    )

    return NextResponse.json({data: {$id: memberToDelete.$id}})

}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<Params> },
){
    const { memberId } = await params
    const userHeader = request.headers.get("user")
    const user: Models.User<Models.Preferences> = JSON.parse(userHeader!);
    const userProperties = await getUserProperties()

    const {role} = await request.json()

    if (!userProperties) {
        return NextResponse.json({ error: "Unable to get userProperties: ./api/members/[memberId]: PATCH" }, { status: 501 })
    }
    const databases = userProperties.databases

    const memberToUpdate = await databases.getDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_MEMBERS_ID!,
        memberId
    )

    const allMembersInWorkspace = await databases.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_MEMBERS_ID!,
        [
            Query.equal("workspaceId", memberToUpdate.workspaceId)
        ]
    );

    const member = await getMember({
        databases,
        workspaceId: memberToUpdate.workspaceId,
        userId: user.$id
    })

    if(!member){
        return NextResponse.json({ error: "Unauthorized to update members: ./api/members/[memberId]: PATCH" }, { status: 401 })
    }

    if(member.role !== MemberRole.ADMIN){
        return NextResponse.json({ error: "Unauthorized to update members; not an Admin: ./api/members/[memberId]: PATCH" }, { status: 401 })
    }
    
    if(allMembersInWorkspace.total === 1){
        return NextResponse.json({ error: "Cannot downgrage the only member: ./api/members/[memberId]: PATCH" }, { status: 400 })

    }

    await databases.updateDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_MEMBERS_ID!,
        memberId,
        {
            role
        }
    )

    return NextResponse.json({data: {$id: memberToUpdate.$id}})
}