import React, { createContext, useEffect, useState } from 'react';

interface TodoContextProps {
  todos: Todo[];
  addTodo: (text: string, days: number[]) => void;
  deleteTodo: (id: string) => void;
  editTodo: (id: string, text: string) => void;
  updateTodoStatus: (id: string) => void;
  moveTodo: (currentIndex: number, direction: 'up' | 'down') => void;
}

export interface Todo {
  id: string;
  text: string;
  status: 'undone' | 'completed';
  days: number[];
  count: number;
}

export const TodoContext = createContext<TodoContextProps | undefined>(undefined);

const generateId = () => Math.random().toString(36).substr(2, 9);

const useLocalStorageState = <T,>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [state, setState] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  }, [key, state]);

  return [state, setState];
};

export const TodoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [todos, setTodos] = useLocalStorageState<Todo[]>('todos', []);

  useEffect(() => {
    const checkAndResetTodos = () => {
      const now = new Date();
      const lastResetDate = localStorage.getItem('lastResetDate');
      const today = now.toDateString();

      if (lastResetDate !== today) {
        setTodos(prevTodos =>
            prevTodos.map(todo => ({
              ...todo,
              status: 'undone',
              count: todo.count+1
            }))
        );
        localStorage.setItem('lastResetDate', today);
      }
    };

    checkAndResetTodos();

    // Schedule next check
    const scheduleNextReset = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      const timeUntilMidnight = tomorrow.getTime() - now.getTime();
      return setTimeout(checkAndResetTodos, timeUntilMidnight);
    };

    const timerId = scheduleNextReset();
    return () => clearTimeout(timerId);
  }, []);

  const addTodo = (text: string, days: number[]) => {
    const newTodo: Todo = {
      id: generateId(),
      text,
      status: 'undone',
      days,
      count: 1,
    };
    setTodos(prevTodos => [...prevTodos, newTodo]);
  };

  const deleteTodo = (id: string) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
  };

  const editTodo = (id: string, text: string) => {
    setTodos(prevTodos =>
        prevTodos.map(todo =>
            todo.id === id ? { ...todo, text } : todo
        )
    );
  };

  const updateTodoStatus = (id: string) => {
    setTodos(prevTodos =>
        prevTodos.map(todo =>
            todo.id === id
                ? { ...todo, status: todo.status === 'undone' ? 'completed' : 'undone' }
                : todo
        )
    );
  };

  const moveTodo = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= todos.length) return;

    const newTodos = [...todos];
    [newTodos[index], newTodos[newIndex]] = [newTodos[newIndex], newTodos[index]];
    setTodos(newTodos);
  };

  const value: TodoContextProps = {
    todos,
    addTodo,
    deleteTodo,
    editTodo,
    updateTodoStatus,
    moveTodo,
  };

  return (
      <TodoContext.Provider value={value}>{children}</TodoContext.Provider>
  );
};

export default TodoProvider;