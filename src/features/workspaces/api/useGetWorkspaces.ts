import { rootUrl } from "@/lib/constants";
import { useQuery } from "@tanstack/react-query";
import { Models } from "node-appwrite";


export const useGetWorkspaces = () =>{
    const query = useQuery({
        queryKey: ["workspaces"],
        queryFn: async () =>{
            const res = await fetch(`${rootUrl}/api/workspaces`, {
                method: 'GET'
            })
            if(!res.ok){
                // return null
                throw new Error("Failed to fetch workspaces")
            }
            const {data}: {data: Models.DocumentList<Models.Document>} = await res.json();
            return data;
        }

    })
    return query;
}