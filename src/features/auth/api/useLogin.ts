
import { POST } from "@/app/api/auth/login/route";
import { rootUrl } from "@/lib/constants";
import { loginSchema } from "@/lib/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";

type RequestProps =  z.infer<typeof loginSchema>
// type ResponseProps = {
//     success: string
// }

type ResType = typeof POST


export const useLogin = () => {
    const router = useRouter()
    const queryClient = useQueryClient()
    const mutation = useMutation<ResType ,Error, RequestProps>({
        mutationFn: async(json) => {
            const response = await fetch(`${rootUrl}/api/auth/login`, {
                method: 'POST',
                body: JSON.stringify(json)
            })
            // console.log(await response.json())
            if(!response.ok){
                throw new Error("Something went wrong while loging in: Response not ok")
            }
            return await response.json();
        },
        onSuccess: () => {
            toast.success("Logged in")
            router.refresh()
            queryClient.invalidateQueries({queryKey: ["current"]})
        },
        onError: () => {
            toast.error("Failed to login")
        }
        
    })
    return mutation
}