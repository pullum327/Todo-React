import axios from 'axios';

const api = axios.create({
  baseURL: 'https://dummyjson.com'
});

export const getTodos = async () => {
  const { data } = await api.get('https://dummyjson.com/todos/');
  return data.todos;
};


export const deleteTodo = async (id) => {
  try {
    const { data } = await axios.delete(`https://dummyjson.com/todos/${id}`);
    console.log(`[✓] 已刪除 Todo ID: ${id}`);
    console.log('伺服器回應:', data);
    return data;
  } catch (error) {
    console.error(`[✗] 刪除 Todo ID ${id} 發生錯誤:`, error);
    throw error;
  }
};


export const toggleTodo = async (todo) => {
  try {
    const { data } = await api.put(`/todos/${todo.id}`, {
      completed: !todo.completed,
    });
    console.log(`[✓] 切換完成狀態: ID ${todo.id}`);
    return data;
  } catch (error) {
    console.warn(`[!] DummyJSON 不存在該 ID，僅更新本地資料: ID ${todo.id}`);
    return todo; 
  }
};

