import mongoose from 'mongoose';
import { BAD_REQUEST, FORBIDDEN, NOT_FOUND } from '../constants/http';
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

type UpdatePostParams = {
  id: string;
  title?: string;
  content?: string;
  userId: string;
};

export const updatePostService = async ({
  id,
  title,
  content,
  userId,
}: UpdatePostParams) => {
  // 1. id 유효성 검사
  appAssert(
    mongoose.isValidObjectId(id),
    BAD_REQUEST,
    '게시글 아이디를 전달하지 않거나, 유효하지 않은 포스트 아이디를 전달하였습니다.'
  );

  // 2. userId 유효성 검사
  appAssert(
    mongoose.isValidObjectId(userId),
    BAD_REQUEST,
    '유효하지 않은 사용자 아이디를 전달하였습니다.'
  );

  // 3. 수정할 필드가 최소 1개 이상 있는지 검사
  appAssert(
    title !== undefined || content !== undefined,
    BAD_REQUEST,
    '수정할 내용을 1개 이상 전달해 주세요.'
  );

  // 4. 해당 게시글 존재 여부 및 권한 확인
  const post = await PostModel.findById(id);
  appAssert(post, NOT_FOUND, '존재하지 않는 게시글입니다.');

  // 5. 권한 확인 (작성자 본인인지)
  appAssert(
    post.author.toString() === userId,
    FORBIDDEN,
    '해당 게시글을 수정할 권한이 없습니다.'
  );

  // 6. 수정 진행
  if (title !== undefined) post.title = title;
  if (content !== undefined) post.content = content;

  const updatedPost = await post.save();

  return updatedPost.populate('author', 'email');
};

type DeletePostParams = {
  id: string;
  userId: string;
};

export const deletePostService = async ({ id, userId }: DeletePostParams) => {
  const post = await PostModel.findById(id);
  appAssert(post, NOT_FOUND, '존재하지 않는 게시글입니다.');

  appAssert(
    post.author.toString() === userId,
    FORBIDDEN,
    '해당 게시글을 삭제할 권한이 없습니다.'
  );

  await post.deleteOne({ user: userId });
};
