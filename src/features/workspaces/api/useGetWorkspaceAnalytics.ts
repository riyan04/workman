import { ProjectAnalyticsType } from "@/features/projects/types";
import { useQuery } from "@tanstack/react-query";

interface useGetWorkspaceAnalyticsProps {
    workspaceId: string
}

export const useGetWorkspaceAnalytics = ({ workspaceId }: useGetWorkspaceAnalyticsProps) => {
    const query = useQuery({
        queryKey: ["workspace-analytics", workspaceId],
        queryFn: async () => {
            const res = await fetch(`http://localhost:3000/api/workspaces/${workspaceId}/analytics`)
            if (!res.ok) {
                throw new Error("Failed to fetch workspace analytics")
            }
            const {data}: {data: ProjectAnalyticsType} = await res.json();
            
            return data;
        }

    })
    return query;
}