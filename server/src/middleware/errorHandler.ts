import { Request, Response } from 'express';
import { z } from 'zod';
import { ErrorRequestHandler } from 'express';
import { BAD_REQUEST } from '../constants/http';
import AppError from '../utils/AppError';
import { clearAuthCookies, REFRESH_PATH } from '../utils/cookies';

const handleZodError = (res: Response, error: z.ZodError) => {
  const errors = error.issues.map((err) => ({
    path: err.path.join('.'),
    message: err.message,
  }));

  res.status(BAD_REQUEST).json({
    status: 'error',
    errors,
  });
};

const handleAppError = (res: Response, error: AppError) => {
  res.status(error.statusCode).json({
    message: error.message,
    errorCode: error.errorCode,
  });
};

const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  console.log(`PATH: ${req.path}`, error);

  // error가 리프레시 핸들러에 발생하면 쿠키를 다 지움
  if (req.path === REFRESH_PATH) {
    clearAuthCookies(res);
  }

  if (error instanceof z.ZodError) {
    return handleZodError(res, error);
  }

  if (error instanceof AppError) {
    return handleAppError(res, error);
  }

  res.status(500).send('Internal Server Error');
};

export default errorHandler;
