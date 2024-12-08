import { NextRequest, NextResponse } from "next/server";
import { ID, Models, Query} from "node-appwrite";
import {getUserProperties} from '@/features/auth/actions'
import { MemberRole } from "@/features/members/types";
import { generateInviteCode } from "@/lib/utils";
// import { error } from "console";

export async function POST (request: NextRequest) {
    // const databasesHeader = request.headers.get("databases")
    const userHeader = request.headers.get("user")

    // const databases: Databases = JSON.parse(databasesHeader!);
    const user: Models.User<Models.Preferences>  = JSON.parse(userHeader!);

    const userProperties = await getUserProperties();
    
    if(!userProperties){
        return NextResponse.json({error: "Unable to get userProperties: ./api/workspace"}, {status: 501})
    }
    const databases = userProperties?.databases
    const storage = userProperties?.storage

    const formData = await request.formData()
    const name = formData.get("name")
    const image = formData.get("image")
    // console.log({name, image})


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
    }

    const inviteCode = generateInviteCode(6)

    const workspace = await databases?.createDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_WORKSPACES_ID!,
        ID.unique(),
        {
            name,
            userId: user.$id,
            imageUrl: uploadedImageUrl,
            inviteCode: inviteCode
        }
    )

    await databases.createDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_MEMBERS_ID!,
        ID.unique(),
        {
            userId: user.$id,
            workspaceId: workspace.$id,
            role: MemberRole.ADMIN
        }

    );
    return NextResponse.json({data: workspace})
}


export async function GET(request: NextRequest)  {
    const userHeader = request.headers.get("user")
    const user: Models.User<Models.Preferences>  = JSON.parse(userHeader!);

    const userProperties = await getUserProperties()

    if(!userProperties){
        return NextResponse.json({error: "Unable to get userProperties: ./api/workspace"}, {status: 501})
    }

    const databases = userProperties?.databases


    const members = await databases.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_MEMBERS_ID!,
        [Query.equal("userId", user.$id)]
    );

    if(members.total === 0){
        return NextResponse.json({data: {documents: [], total: 0}})
    }

    const workspaceIds = members.documents.map((member) => (
        member.workspaceId
    ))

    const workspaces = await databases.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_WORKSPACES_ID!,
        [
            Query.orderDesc("$createdAt"),
            Query.contains("$id", workspaceIds)
        ]
    )

    return NextResponse.json({data: workspaces})

    // return NextResponse.json({message: "welcome to the workspaces"})
}