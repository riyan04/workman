"use client"


import { useForm } from "react-hook-form"
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    // CardDescription,
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

import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import Link from "next/link"
import { useLogin } from "../api/useLogin"



const formSchema = z.object({
    email: z.string().trim().email(),
    password: z.string().min(1, "Password required")
})

export const SignInCard = () => {
    const {mutate, isPending} = useLogin()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues:{
            email: "",
            password: ""
        }
    })

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        mutate(values)
    }

    return (
        <Card className=" md:w-[500px] w-full h-full ">
            <CardHeader className=" flex items-center justify-center p-7">
                <div className=" flex items-center justify-center gap-2">
                    <Image src={"/logo.svg"} width={30} height={30} alt="logo" />
                    <CardTitle className=" text-2xl">
                        Welcome back to Workman
                    </CardTitle>
                </div>
            </CardHeader>
            <div className=" px-7">
                <Separator />
            </div>
            <CardContent className=" p-7">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-4">
                        <FormField 
                            name="email"
                            control={form.control}
                            render={({field})=>(
                                <FormItem>
                                   <FormControl>
                                        <Input type="email" placeholder="Email" {...field} />
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
                                   <Input type="password" placeholder="Password" min={8} max={20} {...field} />
                                   </FormControl>
                                   <FormMessage />
                                </FormItem>
                            )}
                        />
                        
                        <Button disabled={isPending} size={"lg"} className=" w-full"> Login</Button>
                    </form>
                </Form>

            </CardContent>

            <div className="px-7">
                <Separator />
            </div>

            <CardContent className=" p-7 flex items-center justify-center gap-2">
                <Button disabled={isPending} variant={"secondary"}> <FcGoogle />Login with Google</Button>
                <Button disabled={isPending} variant={"secondary"}> <FaGithub />Login with GitHub</Button>
            </CardContent>

            <div className="px-7">
                <Separator />
            </div>

            <CardContent className="p-7">
                <p>
                    Don&apos;t have an account?  
                    <Link href={"/sign-up"}>
                    <span className=" text-blue-500">
                        &nbsp;
                        Sign Up
                    </span>
                    </Link>
                </p>
            </CardContent>

        </Card>
    )
}