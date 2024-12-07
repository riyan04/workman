"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { createWorkspaceSchema } from "../schemas"
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
import { useCreateWorkspace } from "../api/useCreateWorkspace"

interface CreateWorkspaceFormPorps {
    onCancel?: () => void
};

const CreateWorkspaceForm = ({ onCancel }: CreateWorkspaceFormPorps) => {
    const {mutate, isPending} = useCreateWorkspace()
    const form = useForm<z.infer<typeof createWorkspaceSchema>>({
        resolver: zodResolver(createWorkspaceSchema),
        defaultValues: {
            name: ""
        }
    });
    const onSubmit = (values: z.infer<typeof createWorkspaceSchema>) => {
        mutate(values)
    }
    return (
        <Card className=" w-full h-full border-none shadow-lg">

            <CardHeader className=" flex p-7">
                <CardTitle className=" text-xl font-bold">
                    Create a new Workspace
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
                        </div>
                        <div className=" p-7">
                            <Separator />
                        </div>
                        {/* <Separator className=" py-7" /> */}
                        <div className=" flex items-center justify-between">
                            <Button disabled={isPending} type="button" size={"lg"} variant={"secondary"} onClick={onCancel}>
                                Cancel
                            </Button>
                            <Button disabled={isPending} type="submit" size={"lg"} onClick={onCancel}>
                                Create Workspace
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>

        </Card>
    )
}

export default CreateWorkspaceForm