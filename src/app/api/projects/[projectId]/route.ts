import { getUserProperties } from "@/features/auth/actions";
import { getMember } from "@/features/members/utils";
import { ProjectType } from "@/features/projects/types";
import { NextRequest, NextResponse } from "next/server";
import { ID, Models } from "node-appwrite";

interface Params {
    projectId: string;
}

export async function GET(request: NextRequest, {params}: {params: Params}){
    const userHeader = request.headers.get("user")
    const user: Models.User<Models.Preferences> = JSON.parse(userHeader!);

    const userProperties = await getUserProperties();
    if (!userProperties) {
        return NextResponse.json({ error: "Unable to get userProperties: ./api/projects/[projectsId]:GET" }, { status: 501 })
    }
    const databases = userProperties.databases
    const {projectId} = await params
    if(!projectId){
        return NextResponse.json({ error: "Unable to get projectId: ./api/projects/[projectsId]:GET" }, { status: 501 })
    }

    const project = await databases.getDocument<ProjectType>(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_PROJECTS_ID!,
        projectId
    )

    const member = await getMember({databases: databases, workspaceId: project.workspaceId, userId: user.$id})


    if (!member) {
        return NextResponse.json({ error: "Unauthorized to get the project: ./api/projects/[projectId]:GET" }, { status: 401 })
    }

    return NextResponse.json({data: project})
}

export async function PATCH(request: NextRequest, {params}: {params: Params} ) {

    const userHeader = request.headers.get("user")
    const user: Models.User<Models.Preferences> = JSON.parse(userHeader!);

    const userProperties = await getUserProperties();
    if (!userProperties) {
        return NextResponse.json({ error: "Unable to get userProperties: ./api/projects/[projectsId]:PATCH" }, { status: 501 })
    }
    const databases = userProperties?.databases
    const storage = userProperties?.storage

    const {projectId} = await params
    if(!projectId){
        return NextResponse.json({ error: "Unable to get projectId: ./api/projects/[projectsId]:PATCH" }, { status: 501 })
    }

    
    
    const formData = await request.formData()
    const name = formData.get("name")
    const image = formData.get("image")

    
    const existingProject = await databases.getDocument<ProjectType>(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_PROJECTS_ID!,
        projectId
    )
    const member = await getMember({databases: databases, workspaceId: existingProject.workspaceId, userId: user.$id})


    if (!member) {
        return NextResponse.json({ error: "Unauthorized to update the project: ./api/projects/[projectId]:PATCH" }, { status: 401 })
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


    const project = await databases.updateDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_PROJECTS_ID!,
        projectId,
        {
            name,
            imageUrl: uploadedImageUrl
        }
    )

    return NextResponse.json({data: project})
}

export async function DELETE(request: NextRequest, {params}: {params: Params}){
    const userProperties = await getUserProperties()
    if(!userProperties){
        return NextResponse.json({ error: "Unable to get userProperties: ./api/projects/[projects]:DELETE" }, { status: 501 })
    }
    const databases = userProperties.databases
    const userHeader = request.headers.get("user")
    const user: Models.User<Models.Preferences> = JSON.parse(userHeader!);
    const {projectId} = await params
    if(!projectId){
        return NextResponse.json({ error: "Unable to get projectId: ./api/projects/[projects]:DELETE" }, { status: 501 })
    }

    const existingProject = await databases.getDocument<ProjectType>(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_PROJECTS_ID!,
        projectId
    )

    const member = await getMember({
        databases: databases,
        workspaceId: existingProject.workspaceId,
        userId: user.$id
    });

    if(!member){
        return NextResponse.json({ error: "Unauthorized to delete the project: ./api/workspace/[workspaceId]:DELETE" }, { status: 401 })
    }

    // TODO: Delete tasks
    await databases.deleteDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_PROJECTS_ID!,
        projectId
    )

    return NextResponse.json({data: {$id: existingProject.$id}})
}