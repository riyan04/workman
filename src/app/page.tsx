import { getUser } from "@/features/auth/actions";
import { UserButton } from "@/features/auth/components/UserButton";
import {redirect} from 'next/navigation'

export default async function Home() {
  const user = await getUser()
  console.log(user);
  if(!user){
    redirect("/sign-in");
  }
  return (
    <>
      <div>
        only visible to authorized users
        <UserButton />
      </div>

    </>
  );
}
