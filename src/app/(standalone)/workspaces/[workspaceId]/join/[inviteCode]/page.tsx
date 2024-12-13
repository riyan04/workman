import { getUser } from "@/features/auth/actions";
import { getWorkspaceInfo } from "@/features/workspaces/actions";
import JoinWorkspaceForm from "@/features/workspaces/components/JoinWorkspaceForm";
import { redirect } from "next/navigation";

interface WorkspaceIdJoinPageProps{
  params: {
      workspaceId: string
  }
}

const WorkspaceIdJoinPage = async ({
  params
}: WorkspaceIdJoinPageProps) => {
  const user = await getUser()
  if (!user) {
    redirect("/sign-in");
  }
  const {workspaceId} = await params
  const workspaceInfo = await getWorkspaceInfo({
    workspaceId: workspaceId
  })
  if(!workspaceInfo){
    redirect("/")
  }
  return (
    <div className=" w-full lg:max-w-xl">
      <JoinWorkspaceForm initialValues={workspaceInfo} />
    </div>
  )
}

export default WorkspaceIdJoinPage