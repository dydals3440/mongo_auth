import { Router } from 'express';
import {
  createPostHandler,
  getPostHandler,
} from '../controllers/post.controller';
import authenticate from '../middleware/authenticate';

const postRoutes = Router();

postRoutes.get('/', getPostHandler);
postRoutes.post('/', authenticate, createPostHandler);

export default postRoutes;
