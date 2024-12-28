import { Models } from "node-appwrite";

export type ProjectType = Models.Document & {
    name: string,
    imageUrl: string,
    workspaceId: string
}

export type ProjectAnalyticsType = {
    taskCount: number;
    taskDifference: number;
    projectCount?: number;
    projectDifference?: number;
    assignedTaskCount: number;
    assignedTaskDifference: number;
    incompleteTaskCount?: number;
    incompleteTaskDifference?: number;
    completedTaskCount: number;
    completedTaskDifference: number;
    overDueTaskCount: number;
    overDueTaskDifference: number;
}