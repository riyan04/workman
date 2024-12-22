import { Card, CardContent } from "@/components/ui/card"
import { useGetMembers } from "@/features/members/api/useGetMembers"
import { useGetProjects } from "@/features/projects/api/useGetProjects"
import { useWorkspaceId } from "@/features/workspaces/hooks/useWorkspaceId"
import { Loader } from "lucide-react"
import CreateTaskForm from "./CreateTaskForm"

interface CreateTaskFormWrapperProps{
    onCancel: () => void
}

export const CreateTaskFormWrapper = ({onCancel}: CreateTaskFormWrapperProps) => {
    const workspaceId = useWorkspaceId()
    const {data: projects, isLoading: isLoadingProjects} = useGetProjects({workspaceId})
    const {data: members, isLoading: isLoadingMembers} = useGetMembers({workspaceId})

    const projectOptions = projects?.documents.map((project) => (
        {
            id: project.$id,
            name: project.name,
            imageUrl: project.imageUrl
        }
    ))

    const memberOptions = members?.documents.map((member) => (
        {
            id: member.$id,
            name: member.name,
        }
    ))

    // if(!projectOptions || !memberOptions){
    //     throw new Error("projectOptions and memberOptions are not found: CreateTaskFormWrapper")
    // }

    const isLoading = isLoadingMembers || isLoadingProjects
    if(isLoading){
        return(
            <Card className=" w-full h-[350px]">
                <CardContent className=" flex items-center justify-center h-full">
                    <Loader className=" size-5 animate-spin text-muted-foreground"/>
                </CardContent>
            </Card>
        )
    }
  return (
    <CreateTaskForm onCancel={onCancel} memberOptions={memberOptions ?? []} projectOptions={projectOptions ?? []} />
  )
}