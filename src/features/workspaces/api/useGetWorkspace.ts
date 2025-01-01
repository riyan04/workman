import { useQuery } from "@tanstack/react-query";
import { WorkspaceType } from "../types";
import { rootUrl } from "@/lib/constants";

interface useGetWorkspaceProps {
    workspaceId: string
}

export const useGetWorkspace = ({ workspaceId }: useGetWorkspaceProps) => {
    const query = useQuery({
        queryKey: ["workspace", workspaceId],
        queryFn: async () => {
            const res = await fetch(`${rootUrl}/api/workspaces/${workspaceId}`)
            if (!res.ok) {
                throw new Error("Failed to fetch workspace")
            }
            const {data}: {data: WorkspaceType} = await res.json();
            
            return data;
        }

    })
    return query;
}