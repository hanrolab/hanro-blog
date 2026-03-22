import { z } from 'zod'

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export const createPostSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  slug: z.string().min(1).max(200).regex(SLUG_REGEX, 'Invalid slug format'),
  content: z.string().min(1, 'Content is required'),
  thumbnail: z.string().nullable().optional(),
  category: z.string().max(50).nullable().optional(),
  tags: z.string().nullable().optional(),
  published: z.union([z.boolean(), z.number()]),
})

export const updatePostSchema = createPostSchema.partial().extend({
  title: z.string().min(1).max(200),
  content: z.string().min(1),
})

export const loginSchema = z.object({
  password: z.string().min(1, 'Password is required').max(200),
})

export const visitSchema = z.object({
  visitorId: z.string().min(1).max(100).regex(/^[a-zA-Z0-9_-]+$/, 'Invalid visitor ID'),
})

export const slugParamSchema = z.string().min(1).max(200).regex(SLUG_REGEX, 'Invalid slug')
