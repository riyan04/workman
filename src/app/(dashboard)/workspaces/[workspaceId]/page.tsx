import { getUser } from "@/features/auth/actions";
import { redirect } from "next/navigation";


const WorkspaceIdPage = async() => {
  const user = await getUser()
  // console.log(user);
  if(!user){
    redirect("/sign-in");
  }
  return (
    <div>WorkspaceIdPage</div>
  )
}

export default WorkspaceIdPage
