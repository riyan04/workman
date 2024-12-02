import { POST } from "@/app/api/auth/signup/route";
import { signupSchema } from "@/lib/types";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

type RequestType =  z.infer<typeof signupSchema>
type ResponseType = typeof POST

export const useSignup = () => {
    const mutation =  useMutation<ResponseType, Error, RequestType>({
        mutationFn: async (json) => {
            const res =await fetch("http://localhost:3000/api/auth/signup", {
                method: 'POST',
                body: JSON.stringify(json)
            })
    
            return await res.json()
        }
    })
    return mutation
}

