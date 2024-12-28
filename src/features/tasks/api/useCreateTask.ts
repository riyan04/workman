

// import { POST } from "@/app/api/workspaces/route"
import { createTaskSchema } from "../schemas";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { toast } from "sonner";
import { Models } from "node-appwrite";

type RequestProps =  z.infer<typeof createTaskSchema>
// type ResponseProps = {
//     success: string
// }

type ResType = {data: Models.Document}
// type ResType = typeof POST: NextResponse<{data: Models.Document}>


export const useCreateTask = () => {
    const queryClient = useQueryClient()
    const mutation = useMutation<ResType ,Error, RequestProps>({
        mutationFn: async(json) => {
            const response = await fetch('http://localhost:3000/api/tasks', {
                method: 'POST',
                body: JSON.stringify(json)
            })
            // console.log(await response.json())
            const res: {data: Models.Document} = await response.json()
            // return await response.json();
            return res
        },
        onSuccess: () => {
            toast.success("Task created")
            // console.log("reached Here, useCreateWorkspace", data.$id)


            // TODO:  redirect to project screen


            queryClient.invalidateQueries({queryKey: ["tasks"]})
            queryClient.invalidateQueries({queryKey: ["project-analytics"]})
            queryClient.invalidateQueries({queryKey: ["workspace-analytics"]})
        },
        onError: () => {
            toast.error("Failed to create task")
        }
        
    })
    return mutation
}