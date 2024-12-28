"use client"

import { PageError } from "@/components/PageError"
import { PageLoader } from "@/components/PageLoader"
import { useGetWorkspace } from "@/features/workspaces/api/useGetWorkspace"
import EditWorkspaceForm from "@/features/workspaces/components/EditWorkspaceForm"
import { useWorkspaceId } from "@/features/workspaces/hooks/useWorkspaceId"


export const WorkspaceIdSettingsClient = () => {
    const workspaceId = useWorkspaceId()

    const {data: initialValues, isLoading} = useGetWorkspace({workspaceId})

    if (isLoading) {
        return <PageLoader />
    }
    if (!initialValues) {
        return <PageError message="Workspace not found" />
    }
    return (
        <div className=" w-full lg:max-w-xl">
            <EditWorkspaceForm initialValues={initialValues} />
        </div>
    )
}