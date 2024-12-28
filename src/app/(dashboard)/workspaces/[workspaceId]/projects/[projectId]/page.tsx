
import { getUser } from "@/features/auth/actions";
import { redirect } from "next/navigation";
import { ProjectIdClient } from "./client";



// const ProjectIdPage = async ({params}: ProjectIdPageProps) => {
const ProjectIdPage = async () => {
    const user = await getUser()
    if (!user) {
        redirect("/sign-in");
    }
    return (
        <ProjectIdClient />
    )
}

export default ProjectIdPage