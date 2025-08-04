// 格式化日期成 yyyy/MM/dd
export const formatDate = (isoStr) => {
  const date = new Date(isoStr);
  return date.toLocaleDateString();
};

// 回傳剩餘天數的文字
export const getRemainingDaysText = (dueDateStr) => {
  const dueDate = new Date(dueDateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  dueDate.setHours(0, 0, 0, 0);

  const diffTime = dueDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return '已到期';
  if (diffDays === 0) return '今天到期';
  return `還有 ${diffDays} 天`;
};

// 是否為今天或已到期
export const isDueSoon = (dueDateStr) => {
  if (!dueDateStr) return false;
  const d = new Date(dueDateStr);
  const today = new Date();
  d.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  return d <= today;
};
