

import { getUser } from "@/features/auth/actions"
import { getWorkspace } from "@/features/workspaces/actions";
import EditWorkspaceForm from "@/features/workspaces/components/EditWorkspaceForm";
import { redirect } from "next/navigation";

interface WorkspaceIdSettingsPageProps{
    params: {
        workspaceId: string
    }
}

const WorkspaceIdSettingsPage = async({params}: WorkspaceIdSettingsPageProps) => {
    const user = await getUser();
    if(!user){
        redirect("/sign-in")
    }

    const {workspaceId} = await params
    const initialValues = await getWorkspace({workspaceId: workspaceId})

    if(!initialValues){
        redirect(`/workspaces/${workspaceId}`)
    }
    return(
        <div className=" w-full lg:max-w-xl">
            <EditWorkspaceForm initialValues={initialValues}/>
        </div>
    )
}

export default WorkspaceIdSettingsPage