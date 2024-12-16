"use server"

// import { cookies } from "next/headers";
import {
    // Account, Client, Databases, 
    Query} from "node-appwrite";
import { getMember } from "../members/utils";
import { WorkspaceType } from "./types";
import { createSessionClient } from "@/lib/appwrite";


export const getWorkspaces = async () => {
    try {
        // const client = new Client()
        //     .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
        //     .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!)

        // const session = (await cookies()).get("workman-session");
        // if (!session) {
        //     return { documents: [], total: 0 };
        // }
        // client.setSession(session.value)
        // const databases = new Databases(client)
        // const account = new Account(client)

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


interface GetWorkspaceProps{
    workspaceId: string
}

export const getWorkspace = async ({workspaceId}:GetWorkspaceProps) => {
    try {

        const {account, databases} = await createSessionClient()
        
        const user = await account.get()

        
        const member = await getMember({databases: databases, workspaceId: workspaceId, userId: user.$id});
        

        if(!member) return null

        const workspace = await databases.getDocument<WorkspaceType>(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
            process.env.NEXT_PUBLIC_APPWRITE_WORKSPACES_ID!,
            workspaceId
        )
        return workspace
    } catch (err) {
        console.log("Reached here",err)
        return null;
    }
}


interface GetWorkspaceInfoProps{
    workspaceId: string
}

export const getWorkspaceInfo = async ({workspaceId}:GetWorkspaceInfoProps) => {
    try {

        const {databases} = await createSessionClient()

        const workspace = await databases.getDocument<WorkspaceType>(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
            process.env.NEXT_PUBLIC_APPWRITE_WORKSPACES_ID!,
            workspaceId
        )
        return {name: workspace.name}
    } catch (err) {
        console.log("Reached here",err)
        return null;
    }
}