import { getUser } from "@/features/auth/actions";
import { redirect } from "next/navigation";
import { WorkspaceIdClient } from "./client";


const WorkspaceIdPage = async () => {
    const user = await getUser()
    // console.log(user);
    if (!user) {
        redirect("/sign-in");
    }
    return (
        <WorkspaceIdClient />
    )
}

export default WorkspaceIdPage
