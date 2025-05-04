import { Router } from 'express';
import { getSessionHandler } from '../controllers/session.controller';
const sessionRoutes = Router();

// prefix: /sessions
sessionRoutes.get('/', getSessionHandler);

export default sessionRoutes;
