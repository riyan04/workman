import { useQuery } from "@tanstack/react-query";
import { ProjectAnalyticsType } from "../types";
import { rootUrl } from "@/lib/constants";
// import { Models } from "node-appwrite";
// import { ProjectType } from "../types";

interface useGetProjectAnalyticsProps {
    projectId: string
}

export const useGetProjectAnalytics = ({ projectId }: useGetProjectAnalyticsProps) => {
    const query = useQuery({
        queryKey: ["project-analytics", projectId],
        queryFn: async () => {
            const res = await fetch(`${rootUrl}/api/projects/${projectId}/analytics`)
            if (!res.ok) {
                throw new Error("Failed to fetch project analytics")
            }
            const {data}: {data: ProjectAnalyticsType} = await res.json();
            
            return data;
        }

    })
    return query;
}