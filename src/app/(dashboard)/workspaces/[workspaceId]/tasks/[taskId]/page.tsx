import { getUser } from "@/features/auth/actions"
import { redirect } from "next/navigation"
import { TaskIdClient } from "./client"


const TaskIdPage = async () => {
    const user = await getUser()
        if(!user){
            redirect("/sign-in")
        }
  return (
    <TaskIdClient />
  )
}

export default TaskIdPage