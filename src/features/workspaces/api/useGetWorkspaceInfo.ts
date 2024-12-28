import { useQuery } from "@tanstack/react-query";

interface useGetWorkspaceInfoProps {
    workspaceId: string
}

export const useGetWorkspaceInfo = ({ workspaceId }: useGetWorkspaceInfoProps) => {
    const query = useQuery({
        queryKey: ["workspace-info", workspaceId],
        queryFn: async () => {
            const res = await fetch(`http://localhost:3000/api/workspaces/${workspaceId}/info`)
            if (!res.ok) {
                throw new Error("Failed to fetch workspace info")
            }
            const {data}: {data: {
                $id: string;
                name: string;
                imageUrl: string;
            }} = await res.json();
            
            return data;
        }

    })
    return query;
}