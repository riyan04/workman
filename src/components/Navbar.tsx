"use client"

import { UserButton } from "@/features/auth/components/UserButton"
import MobileSidebar from "./MobileSidebar"
import { usePathname } from "next/navigation"

const pathnameMap = {
  "tasks": {
    title: "My Tasks",
    description: "View all of your tasks"
  },
  "projects": {
    title: "My Projects",
    description: "View tasks of your project here"
  },
}

const defaultMap = {
  title: "Home",
  description: "Track your projects and tasks"
}

const Navbar = () => {
  const pathname = usePathname()
  const pathnameParts = pathname.split("/")
  const pathnameKey = pathnameParts[3] as keyof typeof pathnameMap

  const {title, description} = pathnameMap[pathnameKey] || defaultMap
  return (
    <nav className=" pt-4 px-6 flex items-center justify-between">
        <div className=" flex-col hidden lg:flex">
            <h1 className=" text-2xl font-semibold">{title}</h1>
            <p className=" text-muted-foreground ">{description}</p>
        </div>
        <MobileSidebar />
        <UserButton />
    </nav>
  )
}

export default Navbar