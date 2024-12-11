"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { updateWorkspaceSchema } from "../schemas"
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
import { useRef } from "react"
import Image from "next/image"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ArrowLeftIcon, ImageIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { WorkspaceType } from "../types"
import { useUpdateWorkspace } from "../api/useUpdateWorkspace"
import { useRouter } from "next/navigation"

interface EditWorkspaceFormPorps {
    onCancel?: () => void;
    initialValues: WorkspaceType
};

const EditWorkspaceForm = ({ onCancel, initialValues }: EditWorkspaceFormPorps) => {
    const router = useRouter()

    const inputRef = useRef<HTMLInputElement>(null)

    const { mutate, isPending } = useUpdateWorkspace()
    const form = useForm<z.infer<typeof updateWorkspaceSchema>>({
        resolver: zodResolver(updateWorkspaceSchema),
        defaultValues: {
            ...initialValues,
            image: initialValues.imageUrl ? initialValues.imageUrl : ""
        }
    });
    const onSubmit = (values: z.infer<typeof updateWorkspaceSchema>) => {
        const finalValues = {
            ...values,
            image: values.image instanceof File ? values.image : "",
        };

        mutate({ form: finalValues, workspaceId: initialValues.$id }, {
            onSuccess: () => {
                // console.log("reached here, CreateWorkspaceForm")
                form.reset();
                onCancel?.();
                // router.push(`/workspaces/${data.$id}`);
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

            <CardHeader className=" flex flex-row items-center gap-x-4 p-7 space-y-0">
                <Button size={"sm"} variant={"secondary"} onClick={onCancel ? onCancel : () => router.push(`/workspaces/${initialValues.$id}`)}>
                    <ArrowLeftIcon />
                    Back
                </Button>
                <CardTitle className=" text-xl font-bold">
                    {initialValues.name}
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
                                            Workspace name
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter the workspace name"
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
                                                <p className=" text-sm">Workspace icon</p>
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
                                                            if (inputRef.current) {
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
                                Save changes
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>

        </Card>
    )
}

export default EditWorkspaceForm