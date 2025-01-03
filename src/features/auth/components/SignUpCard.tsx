"use client"

import { useForm } from "react-hook-form"
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'


import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    // CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"
// import { FcGoogle } from "react-icons/fc";
// import { FaGithub } from "react-icons/fa";
import Link from "next/link"
import { useSignup } from "../api/useSignup"

const formSchema = z.object({
    name: z.string().min(1, "Name required"),
    email: z.string().email(),
    password: z.string().min(8, "Minimum 8 characters required")
})

export const SignUpCard = () => {

    const {mutate, isPending} = useSignup()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues:{
            name: "",
            email: "",
            password: ""
        }

    })

    const onSubmit = (value: z.infer<typeof formSchema>) => {
        mutate(value)
    }

    return (
        <Card className=" md:w-[500px] w-full h-full ">
            <CardHeader className=" flex items-center justify-center p-7">
                <div className=" flex items-center justify-center gap-2">
                    <Image src={"/logo.svg"} width={30} height={30} alt="logo" />
                    <CardTitle className=" text-2xl">
                        Welcome to Workman
                    </CardTitle>
                </div>
                <CardDescription>
                    Get started wit 100% productivity using Workman!
                </CardDescription>
            </CardHeader>
            <div className=" px-7">
                <Separator />
            </div>
            <CardContent className=" p-7">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-4">
                        <FormField 
                            name="name"
                            control={form.control}
                            render={({field})=>(
                                <FormItem>
                                    <FormControl>
                                        <Input type="text" placeholder="Full Name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            name="email"
                            control={form.control}
                            render={({field})=>(
                                <FormItem>
                                    <FormControl>
                                    <Input type="email" placeholder="Email"  {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            name="password"
                            control={form.control}
                            render={({field})=>(
                                <FormItem>
                                    <FormControl>
                                    <Input type="password" placeholder="Password"  {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        
                        <Button disabled={isPending} size={"lg"} className=" w-full"> Sign Up</Button>
                    </form>
                </Form>

            </CardContent>

            {/* <div className="px-7">
                <Separator />
            </div>

            <CardContent className=" p-7 flex items-center justify-center gap-2">
                <Button disabled={isPending} variant={"secondary"}> <FcGoogle />Sign Up with Google</Button>
                <Button disabled={isPending} variant={"secondary"}> <FaGithub />Sign Up with GitHub</Button>
            </CardContent> */}

            <div className="px-7">
                <Separator />
            </div>

            <CardContent className="p-7">
                <p>
                    Already have an account?
                    <Link href={"/sign-in"}>
                    <span className=" text-blue-500">
                        &nbsp;
                        Login
                    </span>
                    </Link>
                </p>
            </CardContent>

        </Card>
    )
}