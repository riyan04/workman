import { getUserProperties } from "@/features/auth/actions";
import { NextRequest, NextResponse } from "next/server";
import { Models } from "../../../../node_modules/node-appwrite/dist/models.mjs";
import { getMember } from "@/features/members/utils";
import { ID, Query } from "node-appwrite";
import { ProjectType } from "@/features/projects/types";

export async function GET (request: NextRequest) {
    const userHeader = request.headers.get("user")
    const userProperties = await getUserProperties()
    
    if(!userProperties){
        return NextResponse.json({error: "Unable to get userProperties: ./api/projects: GET"}, {status: 501})
    }
    const databases = userProperties.databases
    const user: Models.User<Models.Preferences> = JSON.parse(userHeader!);

    const workspaceId = request.nextUrl.searchParams.get("workspaceId")

    if(!workspaceId){
        return NextResponse.json({error: "Unable to get workspaceId: ./api/projects: GET"}, {status: 501})
    }

    const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id
    })
    if(!member){
        return NextResponse.json({error: "Cannot get member: ./api/projects: GET"}, {status: 401})
    }

    const projects = await databases.listDocuments<ProjectType>(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_PROJECTS_ID!,
        [
            Query.equal("workspaceId", workspaceId),
            Query.orderDesc("$createdAt")
        ]
    )

    return NextResponse.json({data: projects})
}

export async function POST (request: NextRequest) {
    const userHeader = request.headers.get("user")
    const user: Models.User<Models.Preferences>  = JSON.parse(userHeader!);

    const userProperties = await getUserProperties();
    
    if(!userProperties){
        return NextResponse.json({error: "Unable to get userProperties: ./api/projects: POST"}, {status: 501})
    }
    const databases = userProperties.databases
    const storage = userProperties.storage

    const formData = await request.formData()
    const name = formData.get("name")
    const image = formData.get("image")
    const workspaceId = formData.get("workspaceId") as string
    // console.log({name, image})

    if(!workspaceId){
        return NextResponse.json({error: "Unable to get workspaceId: ./api/projects: GET"}, {status: 501})
    }


    const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id
    })

    if(!member){
        return NextResponse.json({error: "Cannot get member: ./api/projects: POST"}, {status: 401})
    }

    let uploadedImageUrl: string | undefined;

    if(image instanceof File){
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
    } else{
        uploadedImageUrl = image!
    }


    const project = await databases.createDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_PROJECTS_ID!,
        ID.unique(),
        {
            name,
            // userId: user.$id,
            imageUrl: uploadedImageUrl,
            workspaceId
        }
    )

    
    return NextResponse.json({data: project})
}