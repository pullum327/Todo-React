import { useEffect, useRef } from 'react';
import { formatDate } from './dateUtils';

export default function useTomorrowDueNotifications(todos) {
  const notifiedIds = useRef(new Set());

  useEffect(() => {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission().then((permission) => {
      console.log('🔔 通知權限變更為:', permission);
    });
  }
}, []);

  useEffect(() => {
    if (!todos || !Array.isArray(todos)) return;

    const isDueTomorrow = (dueDate) => {
      const due = new Date(dueDate);
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      due.setHours(0, 0, 0, 0);
      return due.getTime() === tomorrow.getTime();
    };

    const interval = setInterval(() => {
      todos.forEach((todo) => {
        if (!todo.dueDate || todo.completed) return;

        if (
          isDueTomorrow(todo.dueDate) &&
          !notifiedIds.current.has(todo.id)
        ) {
          if (Notification.permission === 'granted') {
            new Notification('📌 明天要做的任務', {
              body: `${todo.todo} 將於明天 (${formatDate(todo.dueDate)}) 到期`,
            });
            notifiedIds.current.add(todo.id);
          }
        }
      });
    }, 600); // 每分鐘檢查一次

    return () => clearInterval(interval);
  }, [todos]);
}
