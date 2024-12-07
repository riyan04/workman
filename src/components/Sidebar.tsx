import Image from "next/image"
import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import Navigation from "./Navigation"


const Sidebar = () => {
    return (
        <aside className=" h-full bg-neutral-50 p-4 w-full">
            <Link href={"/"}>
                <div className=" flex items-center justify-center gap-2">
                    <Image src={"/logo.svg"} height={50} width={50} alt="logo" />
                    <h1 className=" text-2xl font-serif">Workman</h1>
                </div>
            </Link>
            <Separator className=" my-4" />
            <Navigation />
        </aside>
    )
}

export default Sidebar