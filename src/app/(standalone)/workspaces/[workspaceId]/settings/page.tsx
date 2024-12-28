

import { getUser } from "@/features/auth/actions"
import { redirect } from "next/navigation";
import { WorkspaceIdSettingsClient } from "./client";


const WorkspaceIdSettingsPage = async() => {
    const user = await getUser();
    if(!user){
        redirect("/sign-in")
    }

    return(
        <WorkspaceIdSettingsClient />
    )
}

export default WorkspaceIdSettingsPage