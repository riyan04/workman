import { getUser } from "@/features/auth/actions"
import TaskViewSwitcher from "@/features/tasks/components/TaskViewSwitcher"
import { redirect } from "next/navigation"

const TasksPage = async () => {
    const user = await getUser()
    if(!user){
        redirect("/sign-in")
    }
  return (
    <div className=" h-full flex flex-col">
        <TaskViewSwitcher />
    </div>
  )
}

export default TasksPage