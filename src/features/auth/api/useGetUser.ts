import { useQuery } from "@tanstack/react-query";


export const useGetUser = () =>{
    const query = useQuery({
        queryKey: ["current"],
        queryFn: async () =>{
            const res = await fetch("http://localhost:3000/api/auth/get-user", {
                method: 'GET'
            })
            if(!res.ok){
                return null
            }
            const {data} = await res.json();
            return data;
        }

    })
    return query;
}