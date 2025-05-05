import { Request, Response } from 'express';
import { OK } from '../constants/http';
import {
  createPostService,
  deletePostService,
  getPostByIdService,
  getPostService,
  updatePostService,
} from '../service/post.service';
import { createPostSchema, updatePostSchema } from './post.schemas';

export const getPostHandler = async (req: Request, res: Response) => {
  const { limit = 10, cursor } = req.query;

  const { posts, hasNext, nextCursor } = await getPostService({
    limit: Number(limit),
    cursor: cursor as string | undefined,
  });

  res.status(OK).json({
    posts,
    hasNext,
    nextCursor,
  });
};

export const getPostByIdHandler = async (req: Request, res: Response) => {
  const id = req.params.id.toString();
  const post = await getPostByIdService({ id });

  res.status(OK).json(post);
};

export const createPostHandler = async (req: Request, res: Response) => {
  const { title, content } = createPostSchema.parse(req.body);
  const userId = req.userId.toString();

  const post = await createPostService({
    title,
    content,
    userId,
  });

  res.status(OK).json(post);
};

export const updatePostHandler = async (req: Request, res: Response) => {
  const { title, content } = updatePostSchema.parse(req.body);
  const id = req.params.id.toString();
  const userId = req.userId.toString();

  const post = await updatePostService({
    id,
    title,
    content,
    userId,
  });

  res.status(OK).json(post);
};

export const deletePostHandler = async (req: Request, res: Response) => {
  const id = req.params.id.toString();
  const userId = req.userId.toString();

  await deletePostService({ id, userId });

  res.status(OK).json({ message: '게시글 삭제 완료' });
};
