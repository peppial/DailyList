import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useTodo } from '../context';
import { Input } from './Input';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const;

export const AddTodo = () => {
  const [input, setInput] = useState('');
  const [selectedDays, setSelectedDays] = useState<string[]>(['all']);
  const inputRef = useRef<HTMLInputElement>(null);
  const { addTodo } = useTodo();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleDayToggle = (day: string) => {
    setSelectedDays(prev => {
      if (day === 'all') return ['all'];
      if (prev.includes('all')) return [day];
      return prev.includes(day)
          ? prev.filter(d => d !== day)
          : [...prev, day];
    });
  };

  const handleSubmission = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === '') {
      toast.error('Todo field cannot be empty!');
      return;
    }

    // Don't allow submission with no days selected
    if (selectedDays.length === 0) {
      toast.error('Please select at least one day!');
      return;
    }

    addTodo(input, selectedDays.includes('all') ? DAYS.map((_, index) => index) 
        : selectedDays.map(day => DAYS.indexOf(day as typeof DAYS[number]))
    );
    setInput('');
    setSelectedDays(['all']);
    toast.success('Todo added successfully!');
  };

  return (
      <form onSubmit={handleSubmission}>
        <div className="flex flex-col items-center w-full max-w-lg gap-2 p-5 m-auto">
          <div className="flex w-full gap-2">
            <Input
                ref={inputRef}
                type="text"
                placeholder="start typing ..."
                value={input}
                onChange={e => setInput(e.target.value)}
            />
            <button
                type="submit"
                className="px-5 py-2 text-sm font-normal text-blue-300 bg-blue-900 border-2 border-blue-900 active:scale-95 rounded-xl"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            <button
                type="button"
                onClick={() => handleDayToggle('all')}
                className={`px-3 py-1 text-sm rounded-lg ${
                    selectedDays.includes('all')
                        ? 'bg-blue-900 text-blue-300'
                        : 'bg-gray-200 text-gray-700'
                }`}
            >
              All Days
            </button>
            {DAYS.map(day => (
                <button
                    key={day}
                    type="button"
                    onClick={() => handleDayToggle(day)}
                    className={`px-3 py-1 text-sm rounded-lg ${
                        selectedDays.includes(day)
                            ? 'bg-blue-900 text-blue-300'
                            : 'bg-gray-200 text-gray-700'
                    }`}
                >
                  {day.slice(0, 3)}
                </button>
            ))}
          </div>
        </div>
      </form>
  );
};