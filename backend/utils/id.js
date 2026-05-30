export const generateId = (prefix) => {
  const randomSuffix = Math.floor(Math.random() * 900) + 100;
  return `${prefix}-${Date.now()}-${randomSuffix}`;
};
