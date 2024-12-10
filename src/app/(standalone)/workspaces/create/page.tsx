import { getUser } from "@/features/auth/actions";
import CreateWorkspaceForm from "@/features/workspaces/components/CreateWorkspaceForm"
import { redirect } from "next/navigation";


const WorkspaceCreatePage = async() => {
  const user = await getUser()
  // console.log(user);
  if(!user){
    redirect("/sign-in");
  }
  return (
    <div className=" w-full lg:max-w-xl">
        <CreateWorkspaceForm />
    </div>
  )
}

export default WorkspaceCreatePage