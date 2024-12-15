import { getUser } from '@/features/auth/actions'
import { MembersList } from '@/features/workspaces/components/MembersList'
import { redirect } from 'next/navigation'



const WorkspaceIdMembersPage = async() => {
    const user = await getUser()
    if(!user){
        redirect("/sign-in")
    }
  return (
    <div className=' w-full lg:max-w-xl'>
        <MembersList />
    </div>
  )
}

export default WorkspaceIdMembersPage