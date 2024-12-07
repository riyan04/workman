import { getUser } from "@/features/auth/actions";
import {redirect} from 'next/navigation'

export default async function Home() {
  const user = await getUser()
  // console.log(user);
  if(!user){
    redirect("/sign-in");
  }
  return (
    <>
      <div>
        This is the Home Page
      </div>

    </>
  );
}
