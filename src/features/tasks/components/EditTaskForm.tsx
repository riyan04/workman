"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { createTaskSchema } from "../schemas"
import { z } from "zod"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useUpdateTask } from "../api/useUpdateTask"
// import { useRef } from "react"
// import Image from "next/image"
// import { Avatar, AvatarFallback } from "@/components/ui/avatar"
// import { ImageIcon } from "lucide-react"
import { cn } from "@/lib/utils"
// import { useWorkspaceId } from "@/features/workspaces/hooks/useWorkspaceId"
import { DatePicker } from "@/components/DatePicker"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import MemberAvatar from "@/features/members/components/MemberAvatar"
import { TaskStatus, TaskType } from "../types"
import ProjectAvatar from "@/features/projects/components/ProjectAvatar"
// import { redirect } from "next/navigation"

interface EditTaksFormPorps {
    onCancel?: () => void,
    projectOptions: {
        id: string,
        name: string,
        imageUrl: string
    }[];
    memberOptions: {
        id: string,
        name: string,
    }[];
    initialValues: TaskType
};

const EditTaskForm = ({ onCancel, projectOptions, memberOptions, initialValues }: EditTaksFormPorps) => {

    // const router = useRouter()



    // const workspaceId = useWorkspaceId()

    // const inputRef = useRef<HTMLInputElement>(null)

    const { mutate, isPending } = useUpdateTask()
    const form = useForm<z.infer<typeof createTaskSchema>>({
        resolver: zodResolver(createTaskSchema.omit({ workspaceId: true, description: true })),
        defaultValues: {
            ...initialValues,
            dueDate: initialValues.dueDate ? new Date(initialValues.dueDate) : undefined
        }
    });
    const onSubmit = (values: z.infer<typeof createTaskSchema>) => {
        mutate({
            json: values,
            taskId: initialValues.$id 
        }, {
            onSuccess: () => {
                form.reset();
                onCancel?.()
                // TODO: Redirect to new tasks
            }
        })

    }

  

    return (
        <Card className=" w-full h-full border-none shadow-lg">
            <CardHeader className=" flex p-7">
                <CardTitle className=" text-xl font-bold">
                    Edit a Task
                </CardTitle>
            </CardHeader>
            <div className=" px-7">
                <Separator />
            </div>
            <CardContent className=" p-7">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className=" flex flex-col gap-y-4">

                            <FormField
                                name="name"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Task name
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter the task name"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="dueDate"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Due Date
                                        </FormLabel>
                                        <FormControl>
                                            <DatePicker {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="assigneeId"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Assignee
                                        </FormLabel>
                                        <Select
                                            defaultValue={field.value}
                                            onValueChange={field.onChange}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select assignee" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <FormMessage/>
                                            <SelectContent>
                                                {memberOptions.map((member) => (
                                                    <SelectItem key={member.id} value={member.id}>
                                                        <div className=" flex items-center gap-x-2">
                                                            <MemberAvatar 
                                                                className=" size-6"
                                                                name={member.name}
                                                            />
                                                            {member.name}
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            />
                            {/* STATUS */}
                            <FormField
                                name="status"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Status
                                        </FormLabel>
                                        <Select
                                            defaultValue={field.value}
                                            onValueChange={field.onChange}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <FormMessage/>
                                            <SelectContent>
                                                <SelectItem value={TaskStatus.BACKLOG} >
                                                    Backlog
                                                </SelectItem>
                                                <SelectItem value={TaskStatus.TODO} >
                                                    Todo
                                                </SelectItem>
                                                <SelectItem value={TaskStatus.IN_PROGRESS} >
                                                    In Progress
                                                </SelectItem>
                                                <SelectItem value={TaskStatus.IN_REVIEW} >
                                                    In Review
                                                </SelectItem>
                                                <SelectItem value={TaskStatus.DONE} >
                                                    Done
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="projectId"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Project
                                        </FormLabel>
                                        <Select
                                            defaultValue={field.value}
                                            onValueChange={field.onChange}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Project" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <FormMessage/>
                                            <SelectContent>
                                                {projectOptions.map((project) => (
                                                    <SelectItem key={project.id} value={project.id}>
                                                        <div className=" flex items-center gap-x-2">
                                                            <ProjectAvatar 
                                                                className=" size-6"
                                                                name={project.name}
                                                            />
                                                            {project.name}
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className=" p-7">
                            <Separator />
                        </div>
                        {/* <Separator className=" py-7" /> */}
                        <div className=" flex items-center justify-between">
                            <Button
                                className={cn(
                                    !onCancel && "invisible"
                                )}
                                disabled={isPending} type="button" size={"lg"} variant={"secondary"} onClick={onCancel}>
                                Cancel
                            </Button>
                            <Button disabled={isPending} type="submit" size={"lg"}>
                                Save Changes
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>

        </Card>
    )
}

export default EditTaskForm