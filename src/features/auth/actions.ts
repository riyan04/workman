"use server"

import { cookies } from "next/headers";
import { Account, Client, Databases, Storage,
    type Account as AccountType,
    type Databases as DatabasesType,
    type Storage as StorageType
 } from "node-appwrite";

 
 export const getUser = async () => {
     try {
         const client = new Client()
         .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
         .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!)
         
         const session = (await cookies()).get("workman-session");
         if (!session) {
             return null
            }
            client.setSession(session.value)
            const account = new Account(client)
            
            return await account.get()
        } catch (err) {
            console.log(err)
            // return null
        }
    }
    
interface UserPropertiesResponseProps{
    account: AccountType,
    databases: DatabasesType,
    storage: StorageType
}
export const getUserProperties = async (): Promise<UserPropertiesResponseProps | null> => {
    try {
        const client = new Client()
            .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
            .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!)
        

        const session = (await cookies()).get("workman-session");
        if(!session){
            return null
        }
        client.setSession(session.value)

        const account = new Account(client)
        const databases = new Databases(client)
        const storage = new Storage(client)

        return {account, databases, storage}

    } catch (error) {
        return null
        console.log(error)
    }
}