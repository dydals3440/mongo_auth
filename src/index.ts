import 'dotenv/config';
import express, {
  Request,
  Response,
  NextFunction,
  ErrorRequestHandler,
} from 'express';
import connectToDatabase from './config/db';
import { APP_ORIGIN, NODE_ENV, PORT } from './constants/env';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import errorHandler from './middleware/errorHandler';
import { OK } from './constants/http';
import authRoutes from './routes/auth.route';

const app = express();

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS & cookies
app.use(
  cors({
    origin: APP_ORIGIN,
    credentials: true,
  })
);
app.use(cookieParser());

app.get('/', async (_req, res, next) => {
  res.status(OK).json({
    status: 'healthy',
  });
});

app.use('/auth', authRoutes);

app.use(errorHandler);

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT} in ${NODE_ENV} mode`);
  await connectToDatabase();
});
