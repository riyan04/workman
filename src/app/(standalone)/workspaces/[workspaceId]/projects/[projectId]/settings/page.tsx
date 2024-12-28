import { getUser } from '@/features/auth/actions';
import { redirect } from 'next/navigation';
import React from 'react'
import { ProjectIdSettingsClient } from './client';



const ProjectIdSettingsPage = async () => {
    const user = await getUser();
    if (!user) {
        redirect("/sign-in")
    }
   
    return (
        <ProjectIdSettingsClient />
    )
}

export default ProjectIdSettingsPage