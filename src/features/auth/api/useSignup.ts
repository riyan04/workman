import { POST } from "@/app/api/auth/signup/route";
import { rootUrl } from "@/lib/constants";
import { signupSchema } from "@/lib/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";

type RequestType =  z.infer<typeof signupSchema>
type ResponseType = typeof POST

export const useSignup = () => {
    const router = useRouter()
    const queryClient = useQueryClient()
    const mutation =  useMutation<ResponseType, Error, RequestType>({
        mutationFn: async (json) => {
            const res =await fetch(`${rootUrl}/api/auth/signup`, {
                method: 'POST',
                body: JSON.stringify(json)
            })
            if(!res.ok){
                throw new Error("Something went wrong while signing up: Response not ok")
            }
            return await res.json()
        },
        onSuccess: () => {
            toast.success("You are signed up")
            router.refresh()
            queryClient.invalidateQueries({queryKey: ["current"]})
        },
        onError: () => {
            toast.error("Failed to sign up")
        }
    })
    return mutation
}

