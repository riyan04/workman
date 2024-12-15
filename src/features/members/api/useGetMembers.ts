import { useQuery } from "@tanstack/react-query";

interface useGetMembersProps {
    workspaceId: string
}

export const useGetMembers = ({ workspaceId }: useGetMembersProps) => {
    const query = useQuery({
        queryKey: ["members", workspaceId],
        queryFn: async () => {
            console.log("inside the useGetMember")
            console.log(workspaceId)
            const res = await fetch(`http://localhost:3000/api/members?workspaceId=${workspaceId}`, {
                // method: 'GET',
                // body: JSON.stringify(workspaceId)
                
            })
            if (!res.ok) {
                // return null
                // console.log("Res not ok!")
                throw new Error("Failed to fetch members")
            }
            // const {data}: {data: Models.DocumentList<Models.Document>} = await res.json();
            const { data }: {
                data: {
                    documents: {
                        name: string;
                        email: string;
                        $id: string;
                        $collectionId: string;
                        $databaseId: string;
                        $createdAt: string;
                        $updatedAt: string;
                        $permissions: string[];
                    }[];
                    total: number;
                };
            } = await res.json();
            return data;
        }

    })
    return query;
}