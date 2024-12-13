"use client"

import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardDescription, CardContent, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { useJoinWorkspace } from "../api/useJoinWorkspace"
import { useInviteCode } from "../hooks/useInviteCode"
import { useWorkspaceId } from "../hooks/useWorkspaceId"

interface JoinWorkspaceFormProps{
    initialValues: {
        name: string
    }
}
const JoinWorkspaceForm = ({initialValues}: JoinWorkspaceFormProps) => {

    const workspaceId = useWorkspaceId()
    const inviteCode = useInviteCode()
    const {mutate: joinWorkspace, isPending: isJoiningWorkspace} = useJoinWorkspace()

    const onSubmit = () => {
        joinWorkspace({code: inviteCode, workspaceId: workspaceId})
    }
  return (
    <Card className=" w-full h-full border-none shadow-lg">
        <CardHeader className=" p-7">
            <CardTitle className=" text-xl font-bold">
                Join Workspace
            </CardTitle>
            <CardDescription>
                You&apos;ve been invited to join <strong>{initialValues.name}</strong> workspace
            </CardDescription>
        </CardHeader>
        <div className=" px-7">
            <Separator />
        </div>
        <CardContent className=" p-7">
            <div className=" flex flex-col lg:flex-row items-center justify-between gap-3">
                <Button variant={"secondary"} type={"button"} asChild className=" w-full" disabled={isJoiningWorkspace}>
                    <Link href={"/"}>
                        Cancel
                    </Link>
                </Button>
                <Button type={"button"} asChild className=" w-full" onClick={onSubmit} disabled={isJoiningWorkspace}>
                <Link href={"/"}>
                        Join Workspace
                    </Link>
                </Button>
            </div>
        </CardContent>
    </Card>
  )
}

export default JoinWorkspaceForm