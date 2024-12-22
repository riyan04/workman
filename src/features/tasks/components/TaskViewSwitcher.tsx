import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusIcon } from "lucide-react"


const TaskViewSwitcher = () => {
  return (
    <Tabs
        className=" flex-1 w-full border rounded-lg"
    >
        <div className=" h-full flex flex-col overflow-auto p-4">
            <div className=" flex flex-col gap-y-2 lg:flex-row justify-between items-center">
                <TabsList className="w-full lg:w-auto">
                    <TabsTrigger value="table" className=" h-8 w-full lg:w-auto">
                        Table
                    </TabsTrigger>
                    <TabsTrigger value="kanban" className=" h-8 w-full lg:w-auto">
                        Kanban
                    </TabsTrigger>
                    <TabsTrigger value="calendar" className=" h-8 w-full lg:w-auto">
                        Calendar
                    </TabsTrigger>
                </TabsList>
                <Button size={"sm"} className=" w-full lg:w-auto">
                    <PlusIcon className=" size-4" />
                    New
                </Button>
            </div>
            <Separator className=" my-4" />
                Data Filters
            <Separator className=" my-4" />

            <>
                <TabsContent value="table" className=" mt-0">
                    Data Table
                </TabsContent>
                <TabsContent value="kanban" className=" mt-0">
                    Data Kanban
                </TabsContent>
                <TabsContent value="calendar" className=" mt-0">
                    Data Calendar
                </TabsContent>
            </>
        </div>
    </Tabs>
  )
}

export default TaskViewSwitcher