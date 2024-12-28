"use server"

import {
    Query} from "node-appwrite";
import { createSessionClient } from "@/lib/appwrite";


export const getWorkspaces = async () => {
    try {

        const {account, databases} = await createSessionClient()
        
        const user = await account.get()

        const members = await databases.listDocuments(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
            process.env.NEXT_PUBLIC_APPWRITE_MEMBERS_ID!,
            [Query.equal("userId", user.$id)]
        );

        if (members.total === 0) {
            return { documents: [], total: 0 };
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
        return workspaces
    } catch (err) {
        console.log(err)
        return { documents: [], total: 0 };
    }
}