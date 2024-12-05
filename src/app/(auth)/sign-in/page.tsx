
import { getUser } from "@/features/auth/actions"
import { SignInCard } from "@/features/auth/components/SignInCard"
import { redirect } from "next/navigation"

const SignInPage = async() => {
  const user = await getUser()
  if(user){
    redirect("/");
  }
  return (
    <SignInCard />
  )
}

export default SignInPage