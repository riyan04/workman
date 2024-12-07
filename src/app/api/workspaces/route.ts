import { NextRequest, NextResponse } from "next/server";
import { ID, Models} from "node-appwrite";
import {getUserProperties} from '@/features/auth/actions'
// import { error } from "console";

export async function POST (request: NextRequest) {
    // const databasesHeader = request.headers.get("databases")
    const userHeader = request.headers.get("user")

    // const databases: Databases = JSON.parse(databasesHeader!);
    const user: Models.User<Models.Preferences>  = JSON.parse(userHeader!);

    const userProperties = await getUserProperties();

    const databases = userProperties?.databases
    const storage = userProperties?.storage

    const formData = await request.formData()
    const name = formData.get("name")
    const image = formData.get("image")
    // console.log({name, image})

    if(storage === undefined){
        return NextResponse.json({error: "Unable to get storage: ./api/workspace"}, {status: 501})
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
    }

    const workspace = await databases?.createDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_WORKSPACES_ID!,
        ID.unique(),
        {
            name,
            userId: user.$id,
            imageUrl: uploadedImageUrl
        }
    )
    return NextResponse.json({data: workspace})
}