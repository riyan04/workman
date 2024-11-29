import { Button } from "@/components/ui/button"


export default function Home() {
  return (
    <>
      <div className=" flex gap-4">

        <Button>Primary</Button>
        <Button variant={"secondary"}>secondary</Button>
        <Button variant={"destructive"}>Distructive</Button>
        <Button variant={"ghost"}>ghost</Button>
        <Button variant={"link"}>link</Button>
        <Button variant={"outline"}>outline</Button>
        <Button variant={"muted"}>Muted</Button>
        <Button variant={"teritrary"}>teritrary</Button>

      </div>
    </>
  );
}
