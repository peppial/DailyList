import { TodoItem } from './TodoItem'
import { useTodo } from '../context'
import { SiStarship } from 'react-icons/si'
import {useState} from 'react'
import { ChevronUp, ChevronDown } from 'lucide-react'

export const TodoList = () => {
    const { todos, moveTodo} = useTodo()
    const [showCompleted, setShowCompleted] = useState(false)
    
    // Get current day (0 for Sunday to 6 for Saturday)
    const currentDay = new Date().getDay();

    // Filter todos based on current day
    const undoneTodos = todos.filter(todo =>
        todo.status === 'undone' &&
        (todo.days?.length === 0 || todo.days?.includes(currentDay))
    );

    const completedTodos = todos.filter(todo =>
        todo.status === 'completed' &&
       (todo.days?.length === 0 || todo.days?.includes(currentDay))
    );

    const filteredTodos = showCompleted ? completedTodos : undoneTodos;
    
    if (!todos.length || (!showCompleted && undoneTodos.length === 0)) {
        return (
            <div className="max-w-lg px-5 m-auto space-y-4">
                <FilterToggle
                    showCompleted={showCompleted}
                    setShowCompleted={setShowCompleted}
                    undoneCount={undoneTodos.length}
                    completedCount={completedTodos.length}
                />
                <h1 className="flex flex-col items-center gap-5 px-5 py-10 text-xl font-bold text-center rounded-xl bg-zinc-900">
                    <SiStarship className="text-5xl"/>
                    You finished all your tasks! Great job!
                </h1>
            </div>
        )
    }

    return (
        <div className="max-w-lg px-5 m-auto space-y-4">
            <FilterToggle
                showCompleted={showCompleted}
                setShowCompleted={setShowCompleted}
                undoneCount={undoneTodos.length}
                completedCount={completedTodos.length}
            />
            <div className="grid gap-2">
                {filteredTodos.map((todo) => {
                    const todoIndex = todos.findIndex(t => t.id === todo.id)
                    return (
                        <div key={todo.id} className="flex items-center gap-2">
                            <div className="flex flex-col">
                                <button
                                    onClick={() => moveTodo(todoIndex, 'up')}
                                    disabled={todoIndex === 0}
                                    className="p-1 text-zinc-500 hover:text-orange-500 disabled:opacity-30 disabled:hover:text-zinc-500"
                                    aria-label="Move todo up"
                                >
                                    <ChevronUp size={16} />
                                </button>
                                <button
                                    onClick={() => moveTodo(todoIndex, 'down')}
                                    disabled={todoIndex === todos.length - 1}
                                    className="p-1 text-zinc-500 hover:text-orange-500 disabled:opacity-30 disabled:hover:text-zinc-500"
                                    aria-label="Move todo down"
                                >
                                    <ChevronDown size={16} />
                                </button>
                            </div>
                            <div className="flex-1">
                                <TodoItem todo={todo} />
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

const FilterToggle = ({ showCompleted, setShowCompleted, undoneCount, completedCount }: FilterToggleProps) => (
    <div className="flex justify-between items-center p-4 rounded-xl bg-zinc-900">
        <div className="flex items-center gap-2">
            <input
                type="checkbox"
                id="showCompleted"
                checked={showCompleted}
                onChange={(e) => setShowCompleted(e.target.checked)}
                className="w-4 h-4 rounded text-orange-500 focus:ring-orange-500 bg-zinc-800 border-zinc-700"
            />
            <label htmlFor="showCompleted" className="text-sm text-zinc-400">
                Show completed tasks
            </label>
        </div>
        <div className="flex gap-3 text-sm">
            <span className="text-orange-500">{undoneCount} active</span>
            <span className="text-zinc-600">•</span>
            <span className="text-zinc-500">{completedCount} done</span>
        </div>
    </div>
)

interface FilterToggleProps {
    showCompleted: boolean;
    setShowCompleted: (value: boolean) => void;
    undoneCount: number;
    completedCount: number;
}