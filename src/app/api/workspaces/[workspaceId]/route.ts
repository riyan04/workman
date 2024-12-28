
import { getUserProperties } from "@/features/auth/actions";
import { MemberRole } from "@/features/members/types";
import { getMember } from "@/features/members/utils";
import { WorkspaceType } from "@/features/workspaces/types";
import { NextRequest, NextResponse } from "next/server";
import { ID, Models } from "node-appwrite";

interface Params {
    workspaceId: string;
}

export async function GET(
    request: NextRequest, 
    { params }: { params: Promise<Params> },
) {
    const userHeader = request.headers.get("user")
    const user: Models.User<Models.Preferences> = JSON.parse(userHeader!);

    const userProperties = await getUserProperties();
    if (!userProperties) {
        return NextResponse.json({ error: "Unable to get userProperties: ./api/workspace/[workspaceId]:GET" }, { status: 501 })
    }
    const databases = userProperties.databases
    const { workspaceId } = await params
    if (!workspaceId) {
        return NextResponse.json({ error: "Unable to get workspaceId: ./api/workspace/[workspaceId]:GET" }, { status: 501 })
    }

    const member = await getMember({ databases: databases, workspaceId: workspaceId, userId: user.$id })
    if (!member) {
        return NextResponse.json({ error: "Unauthorized to get the workspace: ./api/workspace/[workspaceId]:GET" }, { status: 401 })
    }

    const workspace = await databases.getDocument<WorkspaceType>(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_WORKSPACES_ID!,
        workspaceId
    )

    return NextResponse.json({data: workspace})

}

export async function PATCH(
    request: NextRequest, 
    { params }: { params: Promise<Params> },
) {

    const userHeader = request.headers.get("user")
    const user: Models.User<Models.Preferences> = JSON.parse(userHeader!);

    const userProperties = await getUserProperties();
    if (!userProperties) {
        return NextResponse.json({ error: "Unable to get userProperties: ./api/workspace/[workspaceId]:PATCH" }, { status: 501 })
    }
    const databases = userProperties?.databases
    const storage = userProperties?.storage

    const { workspaceId } = await params
    if (!workspaceId) {
        return NextResponse.json({ error: "Unable to get workspaceId: ./api/workspace/[workspaceId]:PATCH" }, { status: 501 })
    }


    const formData = await request.formData()
    const name = formData.get("name")
    const image = formData.get("image")

    const member = await getMember({ databases: databases, workspaceId: workspaceId, userId: user.$id })


    if (!member || member.role !== MemberRole.ADMIN) {
        return NextResponse.json({ error: "Unauthorized to update the workspace: ./api/workspace/[workspaceId]:PATCH" }, { status: 401 })
    }

    let uploadedImageUrl: string | undefined;

    if (image instanceof File) {
        const file = await storage?.createFile(
            process.env.NEXT_PUBLIC_APPWRITE_IMAGES_BUCKET_ID!,
            ID.unique(),
            image
        );



        const arrayBuffer = await storage?.getFilePreview(
            process.env.NEXT_PUBLIC_APPWRITE_IMAGES_BUCKET_ID!,
            file.$id
        );
        uploadedImageUrl = `data:image/png;base64,${Buffer.from(arrayBuffer).toString("base64")}`
        // console.log(uploadedImageUrl)
    }


    const workspace = await databases.updateDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_WORKSPACES_ID!,
        workspaceId,
        {
            name,
            imageUrl: uploadedImageUrl
        }
    )

    return NextResponse.json({ data: workspace })
}


export async function DELETE(
    request: NextRequest, 
    { params }: { params: Promise<Params> },
) {
    const userProperties = await getUserProperties()
    if (!userProperties) {
        return NextResponse.json({ error: "Unable to get userProperties: ./api/workspace/[workspaceId]:DELETE" }, { status: 501 })
    }
    const databases = userProperties.databases
    const userHeader = request.headers.get("user")
    const user: Models.User<Models.Preferences> = JSON.parse(userHeader!);
    const { workspaceId } = await params
    if (!workspaceId) {
        return NextResponse.json({ error: "Unable to get workspaceId: ./api/workspace/[workspaceId]:DELETE" }, { status: 501 })
    }
    const member = await getMember({
        databases: databases,
        workspaceId: workspaceId,
        userId: user.$id
    });

    if (!member || member.role !== MemberRole.ADMIN) {
        return NextResponse.json({ error: "Unauthorized to update the workspace: ./api/workspace/[workspaceId]:DELETE" }, { status: 401 })
    }

    // TODO: Delete Member, project & tasks
    await databases.deleteDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_WORKSPACES_ID!,
        workspaceId
    )

    return NextResponse.json({ data: { $id: workspaceId } })
}