"use client"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"


interface AuthLayoutProps {
    children: React.ReactNode
}

const AuthLayout = ({children}: AuthLayoutProps) => {

    const pathName = usePathname()
  return (
    <div className=" bg-neutral-100 min-h-screen">


        <div className="mx-auto max-w-screen-2xl p-4">
            <nav className=" flex justify-between items-center">
                <div className=" flex items-center gap-2">
                    <Image src={"/logo.svg"} height={50} width={50} alt="logo" />
                    {/* TODO: Add the name  */}
                    <h1 className=" text-2xl font-serif">Workman</h1>
                </div>
                <Link href={pathName === "/sign-in" ? "/sign-up" : "sign-in"}>
                    <Button variant={"secondary"}>
                        {pathName === "/sign-in" ? "Sign Up" : "Login" }
                    </Button>
                </Link>
            </nav>
            <div className=" flex flex-col items-center justify-center pt-4 md:pt-20">
                {children}
            </div>
        </div>
    </div>
  )
}

export default AuthLayout