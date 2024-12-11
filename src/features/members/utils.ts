import { Query, type Databases } from "node-appwrite";


interface GetMemberProps{
    databases: Databases;
    workspaceId: string;
    userId: string;
};

export const getMember = async ({databases, workspaceId, userId} : GetMemberProps) => {
    const members = await databases.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_MEMBERS_ID!,
        [
            Query.equal("workspaceId", workspaceId),
            Query.equal("userId", userId)
        ]
    );
    return members.documents[0]
}