import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface ProjectAvatarProps {
    image?: string;
    name: string;
    className?: string
    fallbackClassname?: string
}

const ProjectAvatar = (
    {
        image,
        name,
        className,
        fallbackClassname,
    }: ProjectAvatarProps
) => {
    if(image){

        return (
            <div className={cn(
                "size-4 relative rounded-md overflow-hidden",
                className
            )}>

                <Image src={image} alt={name} fill className=" object-cover"/>
            </div>
        )
    }
    return (
        <Avatar className={cn(
            "size-5 rounded-md",
            className
        )}>
            <AvatarFallback className={cn(
                " text-white bg-green-400 font-semibold text-sm uppercase",
                fallbackClassname
            )}>
                {name[0]}
            </AvatarFallback>
        </Avatar>
    )
}

export default ProjectAvatar