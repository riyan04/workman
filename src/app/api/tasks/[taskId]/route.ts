import { NextRequest, NextResponse } from "next/server";
import { Models } from "../../../../../node_modules/node-appwrite/dist/models.mjs";
import { getUserProperties } from "@/features/auth/actions";
import { TaskType } from "@/features/tasks/types";
import { getMember } from "@/features/members/utils";
import { createAdminClient } from "@/lib/appwrite";
import { ProjectType } from "@/features/projects/types";


interface Params {
    taskId: string;
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<Params> },
) {
    const userHeader = request.headers.get("user")
    const user: Models.User<Models.Preferences> = JSON.parse(userHeader!);
    const userProperties = await getUserProperties();
    if (!userProperties) {
        return NextResponse.json({ error: "Unable to get userProperties: ./api/tasks/[taskId]: DELETE" }, { status: 501 })
    }
    const databases = userProperties.databases
    const { taskId } = await params

    const task = await databases.getDocument<TaskType>(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_TASKS_ID!,
        taskId
    )

    const member = await getMember({
        databases,
        workspaceId: task.workspaceId,
        userId: user.$id
    })

    if (!member) {
        return NextResponse.json({ error: "Unauthorized to delete the task: ./api/tasks/[taskId]: DELETE" }, { status: 401 })
    }

    await databases.deleteDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_TASKS_ID!,
        taskId
    )

    return NextResponse.json({ data: { $id: task.$id } })
}



export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<Params> },
) {
    const userHeader = request.headers.get("user")
    const user: Models.User<Models.Preferences> = JSON.parse(userHeader!);

    const userProperties = await getUserProperties()
    if (!userProperties) {
        return NextResponse.json({ error: "Unable to get userProperties: ./api/tasks/[taskId]: PATCH" }, { status: 501 })
    }
    const databases = userProperties.databases

    const { name, status, description, projectId, dueDate, assigneeId } = await request.json()

    const { taskId } = await params

    const existingTask = await databases.getDocument<TaskType>(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_TASKS_ID!,
        taskId
    )

    const member = await getMember({
        databases,
        workspaceId: existingTask.workspaceId,
        userId: user.$id
    });

    if (!member) {
        return NextResponse.json({ error: "Cannot create tasks: ./api/tasks/[taskId]: PATCH" }, { status: 401 })
    }




    const task = await databases.updateDocument<TaskType>(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_TASKS_ID!,
        taskId,
        {
            name,
            status,
            projectId,
            dueDate,
            assigneeId,
            description
        }
    )

    return NextResponse.json({ data: task })
}

export async function GET(
    request: NextRequest,
     { params }: { params: Promise<Params> },
) {
    const userHeader = request.headers.get("user")
    const currentUser: Models.User<Models.Preferences> = JSON.parse(userHeader!);
    const userProperties = await getUserProperties()
    if (!userProperties) {
        return NextResponse.json({ error: "Unable to get userProperties: ./api/tasks/[taskId]: GET" }, { status: 501 })
    }
    const databases = userProperties.databases
    const { users } = await createAdminClient()
    const { taskId } = await params

    const task = await databases.getDocument<TaskType>(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_TASKS_ID!,
        taskId
    )
    const currentMember = await getMember({
        databases,
        workspaceId: task.workspaceId,
        userId: currentUser.$id
    });
    if (!currentMember) {
        return NextResponse.json({ error: "Cannot get currentMember: ./api/tasks/[taskId]: GET" }, { status: 401 })
    }

    const project = await databases.getDocument<ProjectType>(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_PROJECTS_ID!,
        task.projectId
    )

    const member = await databases.getDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_MEMBERS_ID!,
        task.assigneeId
    )

    const user = await users.get(member.userId)
    if (!user) {
        return NextResponse.json({ error: "Cannot get user: ./api/tasks/[taskId]: GET" }, { status: 401 })
    }

    const assignee = {
        ...member,
        name: user.name,
        email: user.email
    }

    const res = {
        ...task,
        project,
        assignee
    }

    return NextResponse.json({
        data: res,
    })

}