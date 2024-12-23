import { Select, SelectContent, SelectItem, SelectSeparator, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useGetMembers } from "@/features/members/api/useGetMembers"
import { useGetProjects } from "@/features/projects/api/useGetProjects"
import { useWorkspaceId } from "@/features/workspaces/hooks/useWorkspaceId"
import { FolderIcon, ListCheckIcon, UserIcon } from "lucide-react"
import { TaskStatus } from "../types"
import { useTaskFilters } from "../hooks/useTaskFilters"
import { DatePicker } from "@/components/DatePicker"

interface DataFiltersProps {
    hideProjectFilter?: boolean
}

export const DataFilters = ({ hideProjectFilter }: DataFiltersProps) => {
    const workspaceId = useWorkspaceId()
    const {data: projects, isLoading: isLoadingProjects} = useGetProjects({workspaceId})
    const {data: members, isLoading: isLoadingMembers} = useGetMembers({workspaceId})

    const isLoading = isLoadingProjects || isLoadingMembers

    const projectOptions = projects?.documents.map((project) => ({
        value: project.$id,
        label: project.name
    }))
    const memberOptions = members?.documents.map((member) => ({
        value: member.$id,
        label: member.name
    }))

    const [{
        status,
        assigneeId,
        projectId,
        // search,
        dueDate
    }, setFilters] = useTaskFilters()

    const onStatusChange = (value: string) => {
        if(value === "all"){
            setFilters({status: null})
        } else {
            setFilters({status: value as TaskStatus})
        }
    }
    const onAssigneeIdChange = (value: string) => {
        setFilters({assigneeId: value === "all" ? null : value as string})
    }
    const onProjectIdChange = (value: string) => {
        setFilters({projectId: value === "all" ? null : value as string})
    }
    const onDueDateChange = (value: string) => {
        setFilters({dueDate: value === "all" ? null : value as string})
    }

    if(isLoading){
        return null
    }
    return (
        <div className=" flex flex-col lg:flex-row gap-2">
            {/* STATUS FILTER */}
            <Select
                defaultValue={status ?? undefined}
                onValueChange={(value)=>{onStatusChange(value)}}
            >
                <SelectTrigger className=" w-full lg:w-auto h-8">
                    <div className=" flex items-center pr-2">
                        <ListCheckIcon className=" size-4 mr-2" />
                        <SelectValue placeholder="All Statuses" />
                    </div>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">
                        All Statuses
                    </SelectItem>
                    <SelectSeparator />
                    <SelectItem value={TaskStatus.BACKLOG}>Backlog</SelectItem>
                    <SelectItem value={TaskStatus.TODO}>Todo</SelectItem>
                    <SelectItem value={TaskStatus.IN_PROGRESS}>In Progress</SelectItem>
                    <SelectItem value={TaskStatus.IN_REVIEW}>In Review</SelectItem>
                    <SelectItem value={TaskStatus.DONE}>Done</SelectItem>
                </SelectContent>
            </Select>


            {/* ASSIGNEEID FILTER */}
            <Select
                defaultValue={assigneeId ?? undefined}
                onValueChange={(value)=>{onAssigneeIdChange(value)}}
            >
                <SelectTrigger className=" w-full lg:w-auto h-8">
                    <div className=" flex items-center pr-2">
                        <UserIcon className=" size-4 mr-2" />
                        <SelectValue placeholder="All Assignees" />
                    </div>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">
                        All Assignees
                    </SelectItem>
                    <SelectSeparator />
                    {
                        memberOptions?.map((member) => (
                            <SelectItem key={member.value} value={member.value}>
                                {member.label}
                            </SelectItem>
                        ))
                    }
                </SelectContent>
            </Select>


            {/* PROJECTID FILTER */}
            <Select
                defaultValue={assigneeId ?? undefined}
                onValueChange={(value)=>{onProjectIdChange(value)}}
            >
                <SelectTrigger className=" w-full lg:w-auto h-8">
                    <div className=" flex items-center pr-2">
                        <FolderIcon className=" size-4 mr-2" />
                        <SelectValue placeholder="All Projects" />
                    </div>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">
                        All Projects
                    </SelectItem>
                    <SelectSeparator />
                    {
                        projectOptions?.map((project) => (
                            <SelectItem key={project.value} value={project.value}>
                                {project.label}
                            </SelectItem>
                        ))
                    }
                </SelectContent>
            </Select>
            
            {/* DUE-DATE FILTER */}
            <DatePicker
                placeholder="Due Date"
                className=" h-8 w-full lg:w-auto"
                value={dueDate ? new Date(dueDate) : undefined}
                onChange={(date) => {
                    setFilters({dueDate: date ? date.toISOString() : null})
                }}
            />
        </div>
    )
}

