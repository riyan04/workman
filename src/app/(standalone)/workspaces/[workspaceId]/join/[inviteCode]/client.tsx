"use client"

import { PageError } from "@/components/PageError"
import { PageLoader } from "@/components/PageLoader"
import { useGetWorkspaceInfo } from "@/features/workspaces/api/useGetWorkspaceInfo"
import JoinWorkspaceForm from "@/features/workspaces/components/JoinWorkspaceForm"
import { useWorkspaceId } from "@/features/workspaces/hooks/useWorkspaceId"

export const WorkspaceIdJoinClient = () => {
    const workspaceId = useWorkspaceId()
    const { data: workspaceInfo, isLoading } = useGetWorkspaceInfo({ workspaceId })
    if (isLoading) {
        return <PageLoader />
    }
    if (!workspaceInfo) {
        return <PageError message="Workspace info not found" />
    }
    const initialValues = {
        name: workspaceInfo.name
    }
    return (
        <div className=" w-full lg:max-w-xl">
            <JoinWorkspaceForm initialValues={initialValues} />
        </div>
    )
}