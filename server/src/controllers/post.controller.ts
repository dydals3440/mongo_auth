import { Request, Response } from 'express';
import { OK } from '../constants/http';
import { createPostService, getPostService } from '../service/post.service';

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
  const { title, content } = req.body;
  const post = await createPostService({
    title,
    content,
    userId: req.userId.toString(),
  });
  res.status(OK).json(post);
};
