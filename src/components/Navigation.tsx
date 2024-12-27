"use client"

import { cn } from '@/lib/utils';
import { SettingsIcon, UsersIcon } from 'lucide-react';
import Link from 'next/link';
import {GoCheckCircle, GoCheckCircleFill, GoHome, GoHomeFill} from 'react-icons/go'
import { useWorkspaceId } from '@/features/workspaces/hooks/useWorkspaceId';
import { usePathname } from 'next/navigation';
const routes = [
    {
        label: "Home",
        href: "",
        icon: GoHome,
        activeIcon: GoHomeFill
    },
    {
        label: "My Tasks",
        href: "/tasks",
        icon: GoCheckCircle,
        activeIcon: GoCheckCircleFill
    },
    {
        label: "Settings",
        href: "/settings",
        icon: SettingsIcon,
        activeIcon: SettingsIcon
    },
    {
        label: "Members",
        href: "/members",
        icon: UsersIcon,
        activeIcon: UsersIcon
    },
    
];


export const Navigation = () => {
    const workspaceId = useWorkspaceId();
    const pathname = usePathname()
  return (
    <ul className=' flex flex-col'>
        {routes.map((route) => {
            const fullHref = `/workspaces/${workspaceId}${route.href}`
            const isActive = pathname === fullHref
            const Icon = isActive ? route.activeIcon : route.icon
            return (
                <Link key={route.href} href={fullHref}>
                    <div className={cn(
                        " flex items-center gap-2.5 p-2.5 rounded-2xl font-medium hover:text-primary hover:bg-lime-200 transition text-neutral-500",
                        isActive && "bg-white shadow-sm hover:opacity-100 text-primary"
                    )}>
                        <Icon className=' size-5 text-neutral-500' />
                        {route.label}
                    </div>
                </Link>
            )
        })}
    </ul>
  )
}

export default Navigation