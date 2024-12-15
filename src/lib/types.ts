import { MemberRole } from '@/features/members/types'
import { z } from 'zod'

export const loginSchema = z.object({
    email: z.string().trim().email(),
    password: z.string().min(1, "Password required")
})

export const signupSchema = z.object({
    name: z.string().min(1, "Name required"),
    email: z.string().email(),
    password: z.string().min(8, "Minimum 8 characters required")
})

export const memberRoleSchema = z.object({
    role: z.nativeEnum(MemberRole)
})