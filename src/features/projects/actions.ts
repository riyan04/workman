import { createSessionClient } from "@/lib/appwrite";
import { getMember } from "../members/utils";
import { ProjectType } from "./types";

interface GetProjectProps{
    projectId: string
}

export const getProject = async ({projectId}:GetProjectProps) => {
    try {

        const {account, databases} = await createSessionClient()
        
        const user = await account.get()

        const project = await databases.getDocument<ProjectType>(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
            process.env.NEXT_PUBLIC_APPWRITE_PROJECTS_ID!,
            projectId
        )
        
        const member = await getMember({databases: databases, workspaceId: project.workspaceId, userId: user.$id});
        

        if(!member) return null

        return project
    } catch (err) {
        console.log("Reached here",err)
        return null;
    }
}