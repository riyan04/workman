import { NextRequest, NextResponse } from "next/server";
import { ID, Models} from "node-appwrite";
import {getUserProperties} from '@/features/auth/actions'

export async function POST (request: NextRequest) {
    // const databasesHeader = request.headers.get("databases")
    const userHeader = request.headers.get("user")

    // const databases: Databases = JSON.parse(databasesHeader!);
    const user: Models.User<Models.Preferences>  = JSON.parse(userHeader!);

    const userProperties = await getUserProperties();
    const databases = userProperties?.databases

    const {name} = await request.json()

    const workspace = await databases?.createDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_WORKSPACES_ID!,
        ID.unique(),
        {
            name,
            userId: user.$id
        }
    )
    return NextResponse.json({data: workspace})
}