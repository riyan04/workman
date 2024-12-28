
import { updateProjectSchema } from "../schemas";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { toast } from "sonner";
import { Models } from "node-appwrite";



interface RequestProps {
    form: z.infer<typeof updateProjectSchema>;
    projectId: string
}

type ResType = {data: Models.Document}


export const useUpdateProject = () => {
    const queryClient = useQueryClient()
    const mutation = useMutation<ResType ,Error, RequestProps>({
        mutationFn: async({form, projectId}) => {
            const formData = new FormData()
            formData.append("name", form.name!)
            formData.append("image", form.image!)
            const response = await fetch(`http://localhost:3000/api/projects/${projectId}`, {
                method: 'PATCH',
                body: formData
            })
            // console.log(await response.json())
            const res: {data: Models.Document} = await response.json()
            console.log(res)
            return res
        },
        onSuccess: ({data}) => {
            toast.success("Project updated")
            queryClient.invalidateQueries({queryKey: ["projects"]})
            queryClient.invalidateQueries({queryKey: ["project", data.$id]})
        },
        onError: () => {
            toast.error("Failed to update project")
        }
        
    })
    return mutation
}