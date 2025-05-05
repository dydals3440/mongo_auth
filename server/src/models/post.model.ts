import mongoose from 'mongoose';

export interface PostDocument extends mongoose.Document {
  title: string;
  content: string;
  author: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new mongoose.Schema<PostDocument>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true, // ← 이 옵션 하나로 createdAt, updatedAt 자동 관리!
  }
);

postSchema.pre('findOneAndUpdate', async function (next) {
  this.set({ updatedAt: new Date() });
  next();
});

const PostModel = mongoose.model<PostDocument>('Post', postSchema);
export default PostModel;
