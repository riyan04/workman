import { Button } from "@/components/ui/button"
import { TaskType } from "../types"
import { PencilIcon, XIcon } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { useState } from "react"
import { useUpdateTask } from "../api/useUpdateTask"
import { Textarea } from "@/components/ui/textarea"

interface TaskDescriptionProps{
    task: TaskType
}

export const TaskDescription = ({task}:TaskDescriptionProps) => {
    const [isEditing, setIsEditing] = useState(false)
    const [value, setValue] = useState(task.description)

    const {mutate, isPending} = useUpdateTask()

    /* 
    name: z.ZodString;
    status: z.ZodNativeEnum<typeof TaskStatus>;
    workspaceId: z.ZodString;
    projectId: z.ZodString;
    dueDate: z.ZodDate;
    assigneeId: z.ZodString;
    description: z.ZodOptional<...>;
    */

    const handleSave = () => {
        mutate({json:{
            name: task.name,
            status: task.status,
            workspaceId: task.workspaceId,
            projectId: task.projectId,
            assigneeId: task.assigneeId,
            dueDate: new Date(task.dueDate),
            description: value
        } , taskId: task.$id})
        setIsEditing((prev) => !prev)
    }

  return (
    <div className=" p-4 border rounded-lg">
        <div className=" flex items-center justify-between">
            <p className=" text-lg font-semibold">Description</p>
            <Button onClick={() => setIsEditing((prev) => !prev)} size={"sm"} variant={"teritrary"}>
                {isEditing 
                    ? (
                        <XIcon className=" size-4" />
                    )
                    : (
                        <PencilIcon className=" size-4" />
                    )
                }
                {isEditing ? "Cancel" : "Edit"}
            </Button>
        </div>
        <Separator className=" my-4" />
        {isEditing ?  (
            <div className=" flex flex-col gap-y-4">
                <Textarea 
                    placeholder="Add a description" 
                    value={value} 
                    rows={4}
                    onChange={(e) => setValue(e.target.value)}
                    disabled={isPending}
                />
                <Button size={"sm"} className=" w-fit ml-auto" onClick={handleSave} disabled={isPending}>
                    {isPending ? "Saving..." : "Save Changes"}
                </Button>
            </div>

        ) : (

            <div>
                {task.description || (
                    <span className=" text-muted-foreground">
                        No description available
                    </span>
                )}
            </div>
        )}
    </div>
  )
}

