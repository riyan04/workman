import { getUserProperties } from "@/features/auth/actions";
import { WorkspaceType } from "@/features/workspaces/types";
import { NextRequest, NextResponse } from "next/server";

interface Params {
    workspaceId: string;
}

export async function GET(
    request: NextRequest, 
    { params }: { params: Promise<Params> }
) {
    

    const userProperties = await getUserProperties();
    if (!userProperties) {
        return NextResponse.json({ error: "Unable to get userProperties: ./api/workspace/[workspaceId]:GET" }, { status: 501 })
    }
    const databases = userProperties.databases
    const { workspaceId } = await params
    if (!workspaceId) {
        return NextResponse.json({ error: "Unable to get workspaceId: ./api/workspace/[workspaceId]:GET" }, { status: 501 })
    }

    const workspace = await databases.getDocument<WorkspaceType>(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_WORKSPACES_ID!,
        workspaceId
    )

    return NextResponse.json({data: {
        $id: workspace.$id, 
        name: workspace.name, 
        imageUrl: workspace.imageUrl
    }})

}