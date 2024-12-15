"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useWorkspaceId } from "../hooks/useWorkspaceId"
import { Button } from "@/components/ui/button"
import { ArrowLeftIcon, MoreVertical } from "lucide-react"
import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import { useGetMembers } from "@/features/members/api/useGetMembers"
import { Fragment } from "react"
import MemberAvatar from "@/features/members/components/MemberAvatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useDeleteMember } from "@/features/members/api/useDeleteMember"
import { useUpdateMember } from "@/features/members/api/useUpdateMember"
import { MemberRole } from "@/features/members/types"
import { useConfirm } from "@/hooks/useConfirm"


export const MembersList = () => {
    const workspaceId = useWorkspaceId()
    console.log("workspaceId: ", workspaceId)
    const {data} = useGetMembers({workspaceId})
    const {mutate: deleteMember, isPending: isDeletingMember} = useDeleteMember()
    const {mutate: updateMember, isPending: isUpdatingMember} = useUpdateMember()

    const handleUpdateMember = (memberId: string, role: MemberRole) => {
        updateMember({
            memberId: memberId,
            role: role
        })
    }
    const [ConfirmDialog, Confirm] = useConfirm(
        "Remove Member",
        "This member will be removed from the workspace",
        "destructive"
    )

    const handleDeleteMember = async(memberId: string) => {
        const ok = await Confirm()

        if(!ok){
            return
        }

        deleteMember({memberId: memberId}, {
            onSuccess: () => {
                window.location.reload()
            }
        })
    }
    // console.log(data)
    return (
        <Card className=" w-full h-full border-none shadow-lg">
            <ConfirmDialog />
            <CardHeader className=" flex flex-row items-center gap-x-4 p-7 space-y-0">
                <Button asChild variant={"secondary"} size={"sm"}>
                    <Link href={`/workspaces/${workspaceId}`}>
                        <ArrowLeftIcon />
                        Back
                    </Link>
                </Button>
                <CardTitle className=" text-xl font-bold">
                    Members List
                </CardTitle>
            </CardHeader>
            <div className="px-7">
                <Separator />
            </div>
            <CardContent className=" p-7">
                {data?.documents.map((member, index) => (
                    <Fragment 
                        key={member.$id}>
                        <div className=" flex items-center gap-2">
                            <MemberAvatar name={member.name} className="size-10" fallbackClassname="text-lg" />
                            <div className=" flex flex-col">
                                <p className=" text-sm font-medium">{member.name}</p>
                                <p className=" text-xs text-muted-foreground">{member.email}</p>
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>

                                    <Button className=" ml-auto" variant={"secondary"} size={"sm"}>

                                        <MoreVertical className=" size-4 text-muted-foreground"/>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent side={"bottom"} align={"end"}>
                                    <DropdownMenuItem className=" font-medium" onClick={()=>handleUpdateMember(member.$id, MemberRole.ADMIN)} disabled={isUpdatingMember}>
                                        Set as Admin
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className=" font-medium" onClick={()=>handleUpdateMember(member.$id, MemberRole.MEMBER)} disabled={isUpdatingMember}>
                                        Set as Member
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className=" font-medium text-amber-700" onClick={()=>handleDeleteMember(member.$id)} disabled={isDeletingMember}>
                                        Remove {member.name}
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        {index<data.documents.length - 1 && (
                            <Separator className=" my-2.5" />
                        )}
                    </Fragment>
                ))}
            </CardContent>
        </Card>
    )
}