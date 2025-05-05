import { z } from 'zod';

export const titleSchema = z
  .string()
  .min(1, {
    message: '제목은 필수로 입력하셔야 합니다.',
  })
  .max(255, {
    message: '제목은 최대 255자까지 입력할 수 있습니다.',
  })
  // Sanitization
  .trim();

export const contentSchema = z
  .string()
  .min(1, {
    message: '내용은 필수로 입력하셔야 합니다.',
  })
  .max(255, {
    message: '내용은 최대 255자까지 입력할 수 있습니다.',
  })
  // Sanitization
  .trim();

export const createPostSchema = z.object({
  title: titleSchema,
  content: contentSchema,
});

export const updatePostSchema = z.object({
  title: titleSchema.optional(),
  content: contentSchema.optional(),
});
