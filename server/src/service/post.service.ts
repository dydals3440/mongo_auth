import PostModel from '../models/post.model';

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
