import React, { createContext } from 'react'
import { nanoid } from 'nanoid'
import { useLocalStorage } from 'usehooks-ts'

interface TodoContextProps {
  todos: Todo[]
  addTodo: (text: string) => void
  deleteTodo: (id: string) => void
  editTodo: (id: string, text: string) => void
  updateTodoStatus: (id: string) => void
  moveTodo: (currentIndex: number, direction: 'up' | 'down') => void;
}

export interface Todo {
  id: string
  text: string
  status: 'undone' | 'completed'
}

export const TodoContext = createContext<TodoContextProps | undefined>(
  undefined,
)

export const TodoProvider = (props: { children: React.ReactNode }) => {
  const [todos, setTodos] = useLocalStorage<Todo[]>('todos', [])

  const addTodo = (text: string) => {
    const newTodo: Todo = {
      id: nanoid(),
      text,
      status: 'undone',
    }

    setTodos([...todos, newTodo])
  }

  const deleteTodo = (id: string) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id))
  }

  const editTodo = (id: string, text: string) => {
    setTodos(prevTodos => {
      return prevTodos.map(todo => {
        if (todo.id === id) {
          return {...todo, text}
        }
        return todo
      })
    })
  }

  const updateTodoStatus = (id: string) => {
    setTodos(prevTodos => {
      return prevTodos.map(todo => {
        if (todo.id === id) {
          return {
            ...todo,
            status: todo.status === 'undone' ? 'completed' : 'undone',
          }
        }
        return todo
      })
    })
  }

  const moveTodo = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= todos.length) return;

    const newTodos = [...todos];
    [newTodos[index], newTodos[newIndex]] = [newTodos[newIndex], newTodos[index]]
    setTodos(newTodos)
  }
  
  
  const value: TodoContextProps = {
    todos,
    addTodo,
    deleteTodo,
    editTodo,
    updateTodoStatus,
    moveTodo,
  }

  return (
      <TodoContext.Provider value={value}>{props.children}</TodoContext.Provider>
  )
}
