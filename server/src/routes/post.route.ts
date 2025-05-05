import { Router } from 'express';
import {
  createPostHandler,
  deletePostHandler,
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
postRoutes.delete('/:id', authenticate, deletePostHandler);

export default postRoutes;
