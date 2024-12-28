import { useQuery } from "@tanstack/react-query";
import { Models } from "node-appwrite";
import { ProjectType } from "../types";

interface useGetProjectsProps {
    workspaceId: string
}

export const useGetProjects = ({ workspaceId }: useGetProjectsProps) => {
    const query = useQuery({
        queryKey: ["projects", workspaceId],
        queryFn: async () => {
            const res = await fetch(`http://localhost:3000/api/projects?workspaceId=${workspaceId}`, {
                // method: 'GET',
                // body: JSON.stringify(workspaceId)
                
            })
            if (!res.ok) {
                // return null
                // console.log("Res not ok!")
                throw new Error("Failed to fetch projects")
            }
            // const {data}: {data: Models.DocumentList<Models.Document>} = await res.json();
            const {data}: {data: Models.DocumentList<ProjectType>} = await res.json();
            
            return data;
        }

    })
    return query;
}