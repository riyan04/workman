import { getUser } from "@/features/auth/actions";
import { redirect } from "next/navigation";
import { WorkspaceIdJoinClient } from "./client";

// interface WorkspaceIdJoinPageProps{
//   params: {
//       workspaceId: string
//   }
// }

const WorkspaceIdJoinPage = async () => {
  const user = await getUser()
  if (!user) {
    redirect("/sign-in");
  }
  return (
    <WorkspaceIdJoinClient />
  )
}

export default WorkspaceIdJoinPage