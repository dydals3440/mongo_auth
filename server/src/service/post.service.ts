import mongoose from 'mongoose';
import { BAD_REQUEST, NOT_FOUND } from '../constants/http';
import PostModel from '../models/post.model';
import appAssert from '../utils/appAssert';

type GetPostsParams = {
  limit: number;
  cursor?: string;
};

export const getPostService = async ({ limit, cursor }: GetPostsParams) => {
  const query = cursor ? { _id: { $lt: cursor } } : {};

  const posts = await PostModel.find(query)
    .populate('author', 'email')
    .sort({ _id: -1 })
    .limit(limit + 1);

  const hasNext = posts.length > limit;
  const resultPosts = hasNext ? posts.slice(0, limit) : posts;
  const nextCursor = hasNext ? resultPosts[resultPosts.length - 1]._id : null;

  return {
    posts: resultPosts,
    hasNext,
    nextCursor,
  };
};

type GetPostByIdParams = {
  id: string;
};

export const getPostByIdService = async ({ id }: GetPostByIdParams) => {
  appAssert(
    mongoose.isValidObjectId(id),
    BAD_REQUEST,
    '게시글 아이디를 전달하지 않거나, 유효하지 않은 포스트 아이디를 전달하였습니다.'
  );

  const post = await PostModel.findById(id).populate('author', 'email');
  appAssert(post, NOT_FOUND, '존재하지 않는 게시글입니다.');

  return post;
};

type CreatePostParams = {
  title: string;
  content: string;
};

export const createPostService = async ({
  title,
  content,
  userId,
}: CreatePostParams & { userId: string }) => {
  const post = await PostModel.create({ title, content, author: userId });

  return post;
};
