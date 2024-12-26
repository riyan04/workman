import { useCallback, useEffect, useState } from "react"
import { TaskStatus, TaskType } from "../types"
import {DragDropContext, Droppable, Draggable, type DropResult} from '@hello-pangea/dnd'
import { KanbanColumnHeader } from "./KanbanColumnHeader"
import { KanbanCard } from "./KanbanCard"

interface DataKanbanProps{
    data: TaskType[];
    onChange: (tasks: {$id: string; status: TaskStatus; position: number}[]) => void
}

const boards: TaskStatus[] = [
    TaskStatus.BACKLOG,
    TaskStatus.TODO,
    TaskStatus.IN_PROGRESS,
    TaskStatus.IN_REVIEW,
    TaskStatus.DONE
]

type TasksState = {
    [key in TaskStatus]: TaskType[]
}



export const DataKanban = ({data, onChange}: DataKanbanProps) => {

    const [tasks, setTasks] = useState<TasksState>(()=>{
        const initialTasks: TasksState = {
            [TaskStatus.BACKLOG]: [],
            [TaskStatus.TODO]: [],
            [TaskStatus.IN_PROGRESS]: [],
            [TaskStatus.IN_REVIEW]: [],
            [TaskStatus.DONE]: [],
        }

        data.forEach((task) => {
            initialTasks[task.status].push(task)
        })

        Object.keys(initialTasks).forEach((status) => {
            initialTasks[status as TaskStatus].sort((a, b) => a.position - b.position)
        })

        return initialTasks
    })


    useEffect(()=>{
        const newTasks: TasksState = {
            [TaskStatus.BACKLOG]: [],
            [TaskStatus.TODO]: [],
            [TaskStatus.IN_PROGRESS]: [],
            [TaskStatus.IN_REVIEW]: [],
            [TaskStatus.DONE]: [],
        }
        data.forEach((task) => {
            newTasks[task.status].push(task)
        })
        Object.keys(newTasks).forEach((status) => {
            newTasks[status as TaskStatus].sort((a, b) => a.position - b.position)
        })
        setTasks(newTasks)
    },[data])

    const onDragEnd = useCallback((result: DropResult) => {
        if(!result.destination){
            return
        }
        const {source, destination} = result
        const sourceStatus = source.droppableId as TaskStatus
        const desStatus = destination.droppableId as TaskStatus

        let updatesPayload: {$id: string; status: TaskStatus; position: number;}[] = []
        setTasks((prevTasks) => {
            const newTasks = {...prevTasks}

            const sourceColumn = [...newTasks[sourceStatus]]

            const [movedTask] = sourceColumn.splice(source.index, 1)

            if(!movedTask){
                console.error("No task found at the source index")
                return prevTasks
            }
            const updatedMovedTask = sourceStatus !== desStatus
                ? {...movedTask, status: desStatus}
                : movedTask

            newTasks[sourceStatus] = sourceColumn

            const desColumn = [...newTasks[desStatus]]
            desColumn.splice(destination.index, 0, updatedMovedTask)
            newTasks[desStatus] = desColumn

            updatesPayload = []

            updatesPayload.push({
                $id: updatedMovedTask.$id,
                status: desStatus,
                position: Math.min((destination.index + 1)*1000, 1_000_000)
            })

            newTasks[desStatus].forEach((task, index) => {
                if(task && task.$id !== updatedMovedTask.$id){
                    const newPosition = Math.min((index + 1) * 1000, 1_000_000)
                    if(task.position !== newPosition){
                        updatesPayload.push({
                            $id: task.$id,
                            status: desStatus,
                            position: newPosition
                        })
                    }
                }
            })

            if(sourceStatus !== desStatus){
                newTasks[sourceStatus].forEach((task, index) => {
                    if(task){
                        const newPosition = Math.min((index + 1) * 1000, 1_000_000)
                        if(task.position !== newPosition){
                            updatesPayload.push({
                                $id: task.$id,
                                status: sourceStatus,
                                position: newPosition
                            })
                        }
                    }
                })
            }
            return newTasks
        })
        onChange(updatesPayload)
    }, [onChange])
  return (
    <DragDropContext onDragEnd={onDragEnd}>
        <div className=" flex overflow-x-auto">
            {boards.map((board) => {
                return (
                    <div key={board} className=" flex-1 mx-2 bg-muted p-1.5 rounded-md min-w-[200px]">
                        <KanbanColumnHeader 
                            board={board}
                            taskCount={tasks[board].length}
                        />
                        <Droppable droppableId={board}>
                            {(provided) => (
                                <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    className=" min-h-[200px] py-1.5"
                                >
                                    {tasks[board].map((task, index) => (
                                        <Draggable
                                            key={task.$id}
                                            draggableId={task.$id}
                                            index={index}
                                        >
                                            {(provided) => (
                                                <div
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    ref={provided.innerRef}
                                                >
                                                    <KanbanCard task={task} />
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </div>
                )
            })}
        </div>
    </DragDropContext>
  )
}
