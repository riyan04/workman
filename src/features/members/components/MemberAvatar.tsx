import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface MemberAvatarProps {
    name: string;
    className?: string;
    fallbackClassname?: string 
}

const MemberAvatar = (
    {
        name,
        className,
        fallbackClassname
    }: MemberAvatarProps
) => {

    return (
        <Avatar className={cn(
            "size-10 transition border border-neutral-300 rounded-full",
            className
        )}>
            <AvatarFallback className={cn(
                "bg-neutral-200 font-medium text-neutral-500 flex items-center justify-center",
                fallbackClassname
            )}>
                {name.charAt(0).toUpperCase()}
            </AvatarFallback>
        </Avatar>
    )
}

export default MemberAvatar