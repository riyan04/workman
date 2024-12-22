import { getUserProperties } from "@/features/auth/actions";
import { getMember } from "@/features/members/utils";
import { ProjectType } from "@/features/projects/types";
import { createAdminClient } from "@/lib/appwrite";
import { NextRequest, NextResponse } from "next/server"
import { ID, Models, Query } from "node-appwrite";


export async function GET(request: NextRequest) {
    const { users } = await createAdminClient()
    const userProperties = await getUserProperties()
    if (!userProperties) {
        return NextResponse.json({ error: "Unable to get userProperties: ./api/tasks: GET" }, { status: 501 })
    }
    const databases = userProperties.databases
    const userHeader = request.headers.get("user")
    const user: Models.User<Models.Preferences> = JSON.parse(userHeader!);
    const searchParams = request.nextUrl.searchParams
    const workspaceId = searchParams.get("workspaceId")!
    const projectId = searchParams.get("projectId")
    const status = searchParams.get("status")
    const search = searchParams.get("search")
    const assigneeId = searchParams.get("assigneeId")
    const dueDate = searchParams.get("dueDate")

    const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id
    });

    if (!member) {
        return NextResponse.json({ error: "Cannot get tasks: ./api/tasks: GET" }, { status: 401 })
    }

    const query = [
        Query.equal("workspaceId", workspaceId),
        Query.orderDesc("$createdAt")
    ]

    if(projectId){
        console.log("projectId: ",projectId)
        query.push(
            Query.equal("projectId", projectId)
        )
    }
    if(status){
        console.log("status: ",status)
        query.push(
            Query.equal("status", status)
        )
    }
    if(assigneeId){
        console.log("assigneeId: ",assigneeId)
        query.push(
            Query.equal("assigneeId", assigneeId)
        )
    }
    if(dueDate){
        console.log("dueDate: ",dueDate)
        query.push(
            Query.equal("dueDate", dueDate)
        )
    }
    if(search){
        console.log("search: ",search)
        query.push(
            Query.search("name", search)
        )
    }

    const tasks = await databases.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_TASKS_ID!,
        query
    )

    const projectIds = tasks.documents.map((task) => task.projectId)
    const assigneeIds = tasks.documents.map((task) => task.assigneeId)

    const projects = await databases.listDocuments<ProjectType>(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_PROJECTS_ID!,
        projectIds.length > 0 
            ? [Query.contains("$id", projectIds)]
            : []
    )
    const members = await databases.listDocuments<ProjectType>(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_MEMBERS_ID!,
        assigneeIds.length > 0 
            ? [Query.contains("$id", assigneeIds)]
            : []
    )

    const assignees = await Promise.all(
        members.documents.map(async(member) => {
            const user = await users.get(member.userId)

            return {
                ...member,
                name: user.name,
                email: user.email
            }
        })
    )

    const populatedTasks = tasks.documents.map((task) => {
        const project = projects.documents.find(
            (project) => project.$id === task.projectId
        )
        const assignee = assignees.find(
            (assignee) => assignee.$id === task.assigneeId
        )

        return {
            ...task,
            project,
            assignee
        }
    })

    return NextResponse.json({
        data: {
            ...tasks,
            documents: populatedTasks
        }
    })
    
}



export async function POST(request: NextRequest) {
    const userHeader = request.headers.get("user")
    const user: Models.User<Models.Preferences> = JSON.parse(userHeader!);

    const userProperties = await getUserProperties()
    if (!userProperties) {
        return NextResponse.json({ error: "Unable to get userProperties: ./api/tasks: POST" }, { status: 501 })
    }
    const databases = userProperties.databases

    const { name, status, workspaceId, projectId, dueDate, assigneeId } = await request.json()

    const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id
    });

    if (!member) {
        return NextResponse.json({ error: "Cannot create tasks: ./api/tasks: POST" }, { status: 401 })
    }

    const highestPositionTask = await databases.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_TASKS_ID!,
        [
            Query.equal("status", status),
            Query.equal("workspaceId", workspaceId),
            Query.orderAsc("position"),
            Query.limit(1)
        ]
    )

    const newPosition =
        highestPositionTask.documents.length > 0
            ? highestPositionTask.documents[0].position + 1000
            : 1000

    const task = await databases.createDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_TASKS_ID!,
        ID.unique(),
        {
            name,
            status,
            workspaceId,
            projectId,
            dueDate,
            assigneeId,
            position: newPosition
        }
    )

    return NextResponse.json({ data: task })
}