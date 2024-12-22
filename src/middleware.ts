import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { Account, Client, 
	// Databases, Storage
} from 'node-appwrite'

// export interface UserRequest extends NextRequest{
// 	account: AccountType,
// 	databases: DatabasesType,
// 	storage: StorageType
// }

// type AdditionContext = {
// 	Variables: {
// 		account: AccountType,
// 		databases: DatabasesType,
// 		storage: StorageType
// 	}
// }

export async function middleware(request: NextRequest){
	if (request.nextUrl.pathname.startsWith('/api/auth/logout') || request.nextUrl.pathname.startsWith('/api/auth/get-user') 
		|| request.nextUrl.pathname.startsWith('/api/workspaces') || request.nextUrl.pathname.startsWith('/api/members') || request.nextUrl.pathname.startsWith('/api/projects') || request.nextUrl.pathname.startsWith('/api/tasks')) {
		// console.log("into the middleware")
		const client = new Client()
			.setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
			.setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!)

		const session = (await cookies()).get("workman-session");

		if(!session){
			return NextResponse.json({error: "unauthorized from middleware"}, {status: 401});
		}

		client.setSession(session.value)

		const account = new Account(client)
		// const databases = new Databases(client)
		// const storage = new Storage(client)
		// console.log(account)


		const user = await account.get()

		const res = NextResponse.next()

		// request.account = account
		// request.databases = databases
		// request.storage = storage
		
		// res.headers.set("account", JSON.stringify(account))
		// res.headers.set("databases", JSON.stringify(databases))
		// res.headers.set("storage", JSON.stringify(storage))

		res.headers.set("user", JSON.stringify(user))

		return res


	}

	return NextResponse.next()

}
