import { addMonths, format, getDay, parse, startOfWeek, subMonths } from "date-fns"
import { TaskType } from "../types"
import { enIN } from 'date-fns/locale'
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import { useState } from "react"
import "react-big-calendar/lib/css/react-big-calendar.css"
import "./data-calendar.css"
import { EventCard } from "./EventCard"
import { Button } from "@/components/ui/button"
import { CalendarDaysIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

interface DataCalendarProps {
    data: TaskType[]
}

const locales = {
    "en-IN": enIN
}

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales
})

interface CustomToolbarProps{
    date: Date;
    onNavigate: (action: "PREV" | "NEXT" | "TODAY") => void
}

const CustomToolbar = ({date, onNavigate}: CustomToolbarProps) => {
    return (
        <div className=" flex mb-4 gap-x-2 items-center w-full lg:w-auto justify-center lg:justify-start">
            <Button
                onClick={() => onNavigate("PREV")}
                variant={"secondary"}
                size={"icon"}
                className=" flex items-center"
            >
                <ChevronLeftIcon className=" size-4" />
            </Button>
            <div className=" flex items-center border border-input rounded-md px-3 py-2 h-8 justify-center w-full lg:w-auto">
                <CalendarDaysIcon className=" size-4 mr-2" />
                <p className=" text-sm">{format(date, "MMM yyyy")}</p>
            </div>
            <Button
                onClick={() => onNavigate("NEXT")}
                variant={"secondary"}
                size={"icon"}
                className=" flex items-center"
            >
                <ChevronRightIcon className=" size-4" />
            </Button>
        </div>
    )
}

export const DataCalendar = ({ data }: DataCalendarProps) => {
    const [value, setValue] = useState(
        data.length > 0 ? new Date(data[0].dueDate) : new Date()
    )
    const events = data.map((task) => ({
        start: new Date(task.dueDate),
        end: new Date(task.dueDate),
        title: task.name,
        project: task.project,
        assignee: task.assignee,
        status: task.status,
        id: task.$id
    }))

    const handleNavigate = (action: "PREV" | "NEXT" | "TODAY") => {
        if(action === "PREV"){
            setValue(subMonths(value, 1))
        }
        else if(action === "NEXT"){
            setValue(addMonths(value, 1))
        }
        if(action === "TODAY"){
            setValue(new Date())
        }
    }

    return (
        <Calendar 
            localizer={localizer}
            date={value}
            events={events}
            views={["month"]}
            defaultView={"month"}
            toolbar
            showAllEvents
            className=" h-full"
            max={new Date(new Date().setFullYear(new Date().getFullYear() + 1))}
            formats={{
                weekdayFormat: (date, culture, localizer) => localizer?.format(date, "EEE", culture) ?? ""
            }}
            components={{
                eventWrapper: ({event}) => (
                    <EventCard id={event.id} title={event.title} assignee={event.assignee} project={event.project} status={event.status}/>
                ),
                toolbar: () => (
                    <CustomToolbar date={value} onNavigate={handleNavigate} />
                )
            }}
        
        />
    )
}
