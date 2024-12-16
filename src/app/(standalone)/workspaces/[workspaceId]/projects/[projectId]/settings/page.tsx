import { getUser } from '@/features/auth/actions';
import { getProject } from '@/features/projects/actions';
import EditProjectForm from '@/features/projects/components/EditProjectForm';
import { redirect } from 'next/navigation';
import React from 'react'

interface ProjectIdSettingsPageProps{
    params: {
        projectId: string
    }
}

const ProjectIdSettingsPage = async ({params}: ProjectIdSettingsPageProps) => {
    const user = await getUser();
    if (!user) {
        redirect("/sign-in")
    }
    const {projectId} = await params
    const initialValues = await getProject({projectId})
    if(!initialValues){
        throw new Error("Project not found")
    }
    return (
        <div className=" w-full lg:max-w-xl"><EditProjectForm initialValues={initialValues}/></div>
    )
}

export default ProjectIdSettingsPage