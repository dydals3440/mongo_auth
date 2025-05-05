import { Router } from 'express';
import {
  createPostHandler,
  getPostByIdHandler,
  getPostHandler,
  updatePostHandler,
} from '../controllers/post.controller';
import authenticate from '../middleware/authenticate';

const postRoutes = Router();

postRoutes.get('/', getPostHandler);
postRoutes.get('/:id', getPostByIdHandler);
postRoutes.post('/', authenticate, createPostHandler);
postRoutes.patch('/:id', authenticate, updatePostHandler);

export default postRoutes;
