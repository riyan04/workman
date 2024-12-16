"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { createProjectSchema } from "../schemas"
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
import { useCreateProject } from "../api/useCreateProject"
import { useRef } from "react"
import Image from "next/image"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ImageIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { useWorkspaceId } from "@/features/workspaces/hooks/useWorkspaceId"
import { redirect } from "next/navigation"

interface CreateProjectFormPorps {
    onCancel?: () => void
};

const CreateProjectForm = ({ onCancel }: CreateProjectFormPorps) => {

    // const router = useRouter()
    
    

    const workspaceId = useWorkspaceId()

    const inputRef = useRef<HTMLInputElement>(null)

    const { mutate, isPending } = useCreateProject()
    const form = useForm<z.infer<typeof createProjectSchema>>({
        resolver: zodResolver(createProjectSchema.omit({workspaceId: true})),
        defaultValues: {
            name: ""
        }
    });
    const onSubmit = (values: z.infer<typeof createProjectSchema>) => {
        const finalValues = {
            ...values,
            workspaceId,
            image: values.image instanceof File ? values.image : "",
        };

        mutate(finalValues, {
            onSuccess: ({data}) => {
                // console.log("reached here, CreateWorkspaceForm")
                form.reset();
                console.log(workspaceId)
                console.log(data.$id)
                redirect(`/workspaces/${workspaceId}/projects/${data.$id}`);
            }
        })

    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            form.setValue("image", file)
        }
    }

    return (
        <Card className=" w-full h-full border-none shadow-lg">

            <CardHeader className=" flex p-7">
                <CardTitle className=" text-xl font-bold">
                    Create a new Project
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
                                            Project name
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter the project name"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="image"
                                control={form.control}
                                render={({ field }) => (
                                    <div className=" flex flex-col gap-y-2">
                                        <div className="flex items-center gap-x-5">
                                            {field.value ? (
                                                <div className=" size-[72px] relative rounded-md overflow-hidden">
                                                    <Image
                                                        src={
                                                            field.value instanceof File
                                                                ? URL.createObjectURL(field.value)
                                                                : field.value
                                                        }
                                                        alt="logo"
                                                        fill
                                                        className=" object-cover"
                                                    />
                                                </div>
                                            ) : (
                                                <Avatar className=" size-[72px]">
                                                    <AvatarFallback>
                                                        <ImageIcon className=" size-[36px] text-neutral-400" />
                                                    </AvatarFallback>
                                                </Avatar>
                                            )}
                                            <div className=" flex flex-col">
                                                <p className=" text-sm">project icon</p>
                                                <p className=" text-sm text-muted-foreground">JPEG, JPG, PNG or SVG, max 1MB</p>
                                                <input
                                                    className=" hidden"
                                                    accept=".jpeg, .png, jpg, .svg"
                                                    type="file"
                                                    ref={inputRef}
                                                    onChange={handleImageChange}
                                                    disabled={isPending}
                                                />
                                                {field.value ? (
                                                    <Button type={"button"} disabled={isPending} variant={"destructive"}
                                                        size={"xs"} className=" w-fit mt-2"
                                                        onClick={() => {
                                                            field.onChange(null)
                                                            if(inputRef.current){
                                                                inputRef.current.value = ""
                                                            }
                                                        }}
                                                    >
                                                        Remove image
                                                    </Button>

                                                ) : (
                                                    <Button type={"button"} disabled={isPending} variant={"teritrary"}
                                                        size={"xs"} className=" w-fit mt-2"
                                                        onClick={() => inputRef.current?.click()}
                                                    >
                                                        Upload image
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
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
                            <Button disabled={isPending} type="submit" size={"lg"} onClick={onCancel}>
                                Create Project
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>

        </Card>
    )
}

export default CreateProjectForm