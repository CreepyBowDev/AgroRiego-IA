export const sendSuccess = (res, message, data = {}) => {
  return res.json({ message, ...data });
};

export const sendError = (res, status, message, error = null) => {
  const payload = { message };
  if (error) {
    payload.error = error.message || error;
  }
  return res.status(status).json(payload);
};
