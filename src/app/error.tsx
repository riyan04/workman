"use client"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"
import Link from "next/link"


const ErrorPage = () => {
  return (
    <div className="h-screen flex flex-col gap-y-4 items-center justify-center">
        <AlertTriangle className=" size-11" />
        <p className=" text-sm text-muted-foreground">
            Something went wrong
        </p>
        <Button size={"sm"}>
            <Link href={"/"}>
                Go Back
            </Link>
        </Button>
    </div>
  )
}

export default ErrorPage