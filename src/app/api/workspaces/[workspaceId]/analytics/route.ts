import { getUserProperties } from "@/features/auth/actions";
import { NextRequest, NextResponse } from "next/server";
import { Models } from "../../../../../../node_modules/node-appwrite/dist/models.mjs";
import { getMember } from "@/features/members/utils";
import { endOfMonth, startOfMonth, subMonths } from "date-fns";
import { Query } from "node-appwrite";
import { TaskStatus } from "@/features/tasks/types";

interface Params {
    workspaceId: string;
}

export async function GET(
    request: NextRequest, 
    { params }: { params: Promise<Params> },
) {
    const userHeader = request.headers.get("user")
    const user: Models.User<Models.Preferences> = JSON.parse(userHeader!);

    const userProperties = await getUserProperties();
    if (!userProperties) {
        return NextResponse.json({ error: "Unable to get userProperties: ./api/workspaces/[workspaceId]/analytics:GET" }, { status: 501 })
    }
    const databases = userProperties.databases
    const { workspaceId } = await params
    if (!workspaceId) {
        return NextResponse.json({ error: "Unable to get workspaceId: ./apiworkspaces/[workspaceId]/analytics:GET" }, { status: 501 })
    }

   

    const member = await getMember({ databases: databases, workspaceId:workspaceId, userId: user.$id })


    if (!member) {
        return NextResponse.json({ error: "Unauthorized to get the project-analytics: ./api/workspaces/[workspaceId]/analytics:GET" }, { status: 401 })
    }

    const now = new Date()
    const thisMonthStart = startOfMonth(now)
    const thisMonthEnd = endOfMonth(now)
    const lastMonthStart = startOfMonth(subMonths(now, 1))
    const lastMonthEnd = endOfMonth(subMonths(now, 1))

    const thisMonthTasks = await databases.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_TASKS_ID!,
        [
            Query.equal("workspaceId", workspaceId),
            Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
            Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString())
        ]
    )
    const lastMonthTasks = await databases.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_TASKS_ID!,
        [
            Query.equal("workspaceId", workspaceId),
            Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
            Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString())
        ]
    )

    const taskCount = thisMonthTasks.total
    const taskDifference = taskCount - lastMonthTasks.total

    const thisMonthAssignedTasks = await databases.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_TASKS_ID!,
        [
            Query.equal("workspaceId", workspaceId),
            Query.equal("assigneeId", member.$id),
            Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
            Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString())
        ]
    )
    const lastMonthAssignedTasks = await databases.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_TASKS_ID!,
        [
            Query.equal("workspaceId", workspaceId),
            Query.equal("assigneeId", member.$id),
            Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
            Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString())
        ]
    )
    const assignedTaskCount = thisMonthAssignedTasks.total
    const assignedTaskDifference = assignedTaskCount - lastMonthAssignedTasks.total


    const thisMonthIncompleteTasks = await databases.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_TASKS_ID!,
        [
            Query.equal("workspaceId", workspaceId),
            Query.notEqual("status", TaskStatus.DONE),
            Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
            Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString())
        ]
    )
    const lastMonthIncompleteTasks = await databases.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_TASKS_ID!,
        [
            Query.equal("workspaceId", workspaceId),
            Query.notEqual("status", TaskStatus.DONE),
            Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
            Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString())
        ]
    )

    const incompleteTaskCount = thisMonthIncompleteTasks.total
    const incompleteTaskDifference = incompleteTaskCount - lastMonthIncompleteTasks.total


    const thisMonthCompletedTasks = await databases.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_TASKS_ID!,
        [
            Query.equal("workspaceId", workspaceId),
            Query.equal("status", TaskStatus.DONE),
            Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
            Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString())
        ]
    )
    const lastMonthCompletedTasks = await databases.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_TASKS_ID!,
        [
            Query.equal("workspaceId", workspaceId),
            Query.equal("status", TaskStatus.DONE),
            Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
            Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString())
        ]
    )

    const completedTaskCount = thisMonthCompletedTasks.total
    const completedTaskDifference = completedTaskCount - lastMonthCompletedTasks.total


    const thisMonthOverDueTasks = await databases.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_TASKS_ID!,
        [
            Query.equal("workspaceId", workspaceId),
            Query.notEqual("status", TaskStatus.DONE),
            Query.lessThan("dueDate", now.toISOString()),
            Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
            Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString())
        ]
    )
    const lastMonthOverDueTasks = await databases.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_TASKS_ID!,
        [
            Query.equal("workspaceId", workspaceId),
            Query.notEqual("status", TaskStatus.DONE),
            Query.lessThan("dueDate", now.toISOString()),
            Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
            Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString())
        ]
    )

    const overDueTaskCount = thisMonthOverDueTasks.total
    const overDueTaskDifference = overDueTaskCount - lastMonthOverDueTasks.total


    return NextResponse.json({
        data: {
            taskCount,
            taskDifference,
            assignedTaskCount,
            assignedTaskDifference,
            incompleteTaskCount,
            incompleteTaskDifference,
            completedTaskCount,
            completedTaskDifference,
            overDueTaskCount,
            overDueTaskDifference
        }
    })
}