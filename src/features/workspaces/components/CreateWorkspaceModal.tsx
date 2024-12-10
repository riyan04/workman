"use client"

import { ResponsiveModal } from "@/components/ResponsiveModal";
import CreateWorkspaceForm from "./CreateWorkspaceForm";
import { useCreateWorkspaceModal } from "../hooks/useCreateWorkspaceModal";

export const CreateWorkspaceModal = () => {
    const {isOpen, setIsOpen, close} = useCreateWorkspaceModal()
    return(
        <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
            <CreateWorkspaceForm onCancel={close} />
        </ResponsiveModal>
    )
}