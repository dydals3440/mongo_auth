import { Request, Response } from 'express';
import { OK } from '../constants/http';
import { createPostService, getPostService } from '../service/post.service';
import { createPostSchema } from './post.schemas';

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
