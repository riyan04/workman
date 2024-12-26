
//USE THIS IN useBulkupdate
import { TaskType } from "@/features/tasks/types";
import { z } from "zod";


// export const TaskBulkUpdateSchema = z.array(
//     z.object({
//         $id: z.string(),
//         status: z.nativeEnum(TaskStatus),
//         position: z.number().int().positive().min(1000).max(1_000_000)
//     })
// )


import { getUserProperties } from "@/features/auth/actions";
import { NextRequest, NextResponse } from "next/server";
import { Query } from "node-appwrite";
import { Models } from "../../../../../node_modules/node-appwrite/dist/models.mjs";
import { getMember } from "@/features/members/utils";
import { TaskBulkUpdateSchema } from "@/features/tasks/schemas";



export async function POST(request: NextRequest) {
    const userHeader = request.headers.get("user")
    const user: Models.User<Models.Preferences> = JSON.parse(userHeader!);
    const {tasks} : z.infer<typeof TaskBulkUpdateSchema> = await request.json()
    // const tasks = tasksJSON.tasks 

    const userProperties = await getUserProperties()
    if (!userProperties) {
        return NextResponse.json({ error: "Unable to get userProperties: ./api/tasks/bulk-update: POST" }, { status: 501 })
    }
    const databases = userProperties.databases

    const taskToUpdate = await databases.listDocuments<TaskType>(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_TASKS_ID!,
        [
            Query.contains("$id", tasks.map((task) => task.$id))
        ]
    )

    const workspaceIds = new Set(taskToUpdate.documents.map((task) => task.workspaceId))
    if(workspaceIds.size !== 1){
        return NextResponse.json({ error: "all tasks must belong to the same workspace: ./api/tasks/bulk-update: POST" }, { status: 501 })
    }

    const workspaceId = workspaceIds.values().next().value!
    const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id
    });
    if (!member) {
        return NextResponse.json({ error: "Cannot bulk-update tasks: ./api/tasks/bulk-update: POST" }, { status: 401 })
    }
    
    const updatedTasks: TaskType[] = await Promise.all(
        tasks.map(async (task) => {
            const {$id, status, position} = task
            return databases.updateDocument(
                process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
                process.env.NEXT_PUBLIC_APPWRITE_TASKS_ID!,
                $id,
                {status, position}
            )
        })
    )

    return NextResponse.json({data: updatedTasks})
}
