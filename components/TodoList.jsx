// TodoList.jsx
import React, { useState } from 'react';
import Spinner from './Spinner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTodos, deleteTodo, toggleTodo } from '../api';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { formatDate, getRemainingDaysText, isDueSoon } from '../utils/dateUtils';
import useTomorrowDueNotifications from '../utils/datetasks';
import { FixedSizeList as List } from 'react-window';

export default function TodoList() {
  const [newTodo, setNewTodo] = useState('');
  const [dueDate, setDueDate] = useState(null);
  const [errorMsg, setErrorMsg] = useState('')
  const queryClient = useQueryClient();

  const { data: todos, isLoading, isError } = useQuery({
    queryKey: ['todos'],
    queryFn: getTodos,
  });
  
  const deleteMutation = useMutation({
  mutationFn: deleteTodo, 
  onSettled: (_, __, id) => {
    queryClient.setQueryData(['todos'], (oldTodos) =>
      oldTodos.filter(todo => todo.id !== id)
    );
  },
});



  const toggleMutation = useMutation({
  mutationFn: toggleTodo,  // 不管是否成功都照做
  onSettled: (updatedTodo) => {
    queryClient.setQueryData(['todos'], (oldTodos) =>
      oldTodos.map((todo) =>
        todo.id === updatedTodo.id
          ? { ...todo, completed: !todo.completed } // 手動切換完成狀態
          : todo
      )
    );
  },
});





  const handleAddTodo = () => {
  if (newTodo.trim()) {
    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    const selected = dueDate ? new Date(dueDate) : null;
    if (selected && selected < today) {
      setErrorMsg('❌ 到期日不可早於今天');
      return;
    }

    const fakeNew = {
      id: Date.now(),
      todo: newTodo,
      completed: false,
      userId: 1,
      dueDate: dueDate?.toISOString(),
    };
    queryClient.setQueryData(['todos'], (old) => [fakeNew, ...(old || [])]);

    setNewTodo('');
    setDueDate(null);
    setErrorMsg(''); 
  }
};


useTomorrowDueNotifications(todos);


  if (isLoading) return <Spinner />;

  if (isError) return <p>Something went wrong!</p>;

  return (
    <div>
      <div className="todo-input">
        <input
          type="text"
          placeholder="Add new task..."
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
        <div className="todo-input">
        <div className="datepicker-group">
  <DatePicker
    selected={dueDate}
    onChange={(date) => setDueDate(date)}
    placeholderText="Select due date"
    dateFormat="yyyy/MM/dd"
    className={`datepicker-input ${errorMsg ? 'error-border' : ''}`}
  />
  {errorMsg && <p className="error-text">{errorMsg}</p>}
</div>
        <button className="add-btn" onClick={handleAddTodo}>+</button>
        </div>
      </div>

      <List
  height={540}
  itemCount={todos.length}
  itemSize={100}     // 改為 100 讓每個項目有更多空間
  width={'100%'}
  outerElementType={({ style, ...props }) => (
    <div {...props} style={{ ...style, overflowX: 'hidden' }} />
  )}
>


        {({ index, style }) => {
          const todo = todos[index];
          return (
            <li
              key={todo.id}
              style={style}
              className={`todo-item ${isDueSoon(todo.dueDate) ? 'due-soon' : ''} ${todo.completed ? 'completed-todo' : ''}`}
            >
              <span
                onClick={() => toggleMutation.mutate(todo)}
                className={todo.completed ? 'completed' : ''}
              >
                {todo.todo}
              </span>
          
              {todo.dueDate && (
                <div className="todo-date">
                  📅 {formatDate(todo.dueDate)}（{getRemainingDaysText(todo.dueDate)}）
                </div>
              )}

              <button onClick={() => deleteMutation.mutate(todo.id)}>Delete</button>
            </li>
          );
        }}
      </List>
    </div>
  );
}
