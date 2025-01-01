
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { MemberRole } from "../types";
import { rootUrl } from "@/lib/constants";
// import { z } from "zod";
// import { memberRoleSchema } from "@/lib/types";



interface RequestProps {
    memberId: string;
    // role: z.infer<typeof memberRoleSchema>
    role: MemberRole
}

type ResType = {data: {$id: string}}
// type ResType = typeof POST: NextResponse<{data: Models.Document}>


export const useUpdateMember = () => {
    const queryClient = useQueryClient()
    const mutation = useMutation<ResType ,Error, RequestProps>({
        mutationFn: async({memberId, role}) => {
            const response = await fetch(`${rootUrl}/api/members/${memberId}`, {
                method: 'PATCH',
                body: JSON.stringify(role)
            })
            const res: {data: {$id: string}} = await response.json()
            return res
        },
        onSuccess: () => {
            toast.success("Member Updated")
            // router.push(`/workspaces/${data.$id}`)

            queryClient.invalidateQueries({queryKey: ["members"]})
            // queryClient.invalidateQueries({queryKey: ["member", data.$id]})
        },
        onError: () => {
            toast.error("Failed to update member")
        }
        
    })
    return mutation
}