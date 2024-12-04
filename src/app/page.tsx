"use client"

import { Button } from "@/components/ui/button"
import { useGetUser } from "@/features/auth/api/useGetUser";
import { useLogout } from "@/features/auth/api/useLogout";
import { useRouter } from "next/navigation";
import { useEffect } from "react";


export default function Home() {
  const router = useRouter();
  const {data, isLoading} = useGetUser();
  const {mutate} = useLogout()

  useEffect(()=>{
    if(!data && !isLoading){
      router.push("/sign-in");
    }
  },[data])
  return (
    <>
      {/* <div className=" flex gap-4">

        <Button>Primary</Button>
        <Button variant={"secondary"}>secondary</Button>
        <Button variant={"destructive"}>Distructive</Button>
        <Button variant={"ghost"}>ghost</Button>
        <Button variant={"link"}>link</Button>
        <Button variant={"outline"}>outline</Button>
        <Button variant={"muted"}>Muted</Button>
        <Button variant={"teritrary"}>teritrary</Button>

      </div> */}
      <div>
        only visible to authorized users
      </div>
      <Button onClick={()=>mutate()}>
        Logout
      </Button>

    </>
  );
}
