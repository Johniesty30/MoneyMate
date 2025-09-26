export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  const status = err.status || 500;
  const messege = err.messege || 'Internal Server Error';

  res.status(status).json({
    status: 'error',
    messege,
  });
};


