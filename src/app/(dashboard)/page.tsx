import { getUser } from "@/features/auth/actions";
import { getWorkspaces } from "@/features/workspaces/actions";
// import CreateWorkspaceForm from "@/features/workspaces/components/CreateWorkspaceForm";
import {redirect} from 'next/navigation'

export default async function Home() {
  const user = await getUser()
  // console.log(user);
  if(!user){
    redirect("/sign-in");
  }

  const workspaces = await getWorkspaces()

  if(workspaces.total === 0){
    redirect("/workspaces/create")
  } else {
    redirect(`workspaces/${workspaces.documents[0].$id}`)
  }

}
