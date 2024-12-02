
import { POST } from "@/app/api/auth/login/route";
import { loginSchema } from "@/lib/types";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

type RequestProps =  z.infer<typeof loginSchema>
// type ResponseProps = {
//     success: string
// }

type ResType = typeof POST


export const useLogin = () => {
    const mutation = useMutation<ResType ,Error, RequestProps>({
        mutationFn: async(json) => {
            const response = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                body: JSON.stringify(json)
            })
            console.log(await response.json())
            return await response.json()
        },
        
    })
    return mutation
}