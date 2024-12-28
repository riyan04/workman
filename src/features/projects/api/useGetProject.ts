import { useQuery } from "@tanstack/react-query";
// import { Models } from "node-appwrite";
import { ProjectType } from "../types";

interface useGetProjectProps {
    projectId: string
}

export const useGetProject = ({ projectId }: useGetProjectProps) => {
    const query = useQuery({
        queryKey: ["project", projectId],
        queryFn: async () => {
            const res = await fetch(`http://localhost:3000/api/projects/${projectId}`)
            if (!res.ok) {
                throw new Error("Failed to fetch project")
            }
            const {data}: {data: ProjectType} = await res.json();
            
            return data;
        }

    })
    return query;
}