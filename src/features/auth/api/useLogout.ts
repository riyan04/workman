
import { POST } from "@/app/api/auth/login/route";
// import { loginSchema } from "@/lib/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
// import { z } from "zod";

// type RequestProps =  z.infer<typeof loginSchema>
// type ResponseProps = {
//     success: string
// }

type ResType = typeof POST


export const useLogout = () => {
    const router = useRouter()
    const queryClient = useQueryClient()
    const mutation = useMutation<ResType ,Error>({
        mutationFn: async() => {
            const response = await fetch('http://localhost:3000/api/auth/logout', {
                method: 'POST'
            })
            // console.log(await response.json())
            if(!response.ok){
                throw new Error("Something went wrong while loging out: Response not ok")
            }
            return await response.json()
        },

        onSuccess: () => {
            toast.success("Logged out")
            router.refresh()
            queryClient.invalidateQueries({queryKey: ["current"]})
        },
        onError: () => {
            toast.error("Failed to log out")
        }
        
    })
    return mutation
}