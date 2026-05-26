import { z } from 'zod';

export const issueSchema = z.object({
  location: z.enum(['face', 'hair', 'body', 'physics', 'toggle', 'other']),
  type: z.enum(['model_error', 'change_artwork', 'adjust_physics', 'add_remove', 'other']),
  priority: z.enum(['high', 'medium', 'low']),
  expected: z.string().max(500).optional(),
  current_state: z.string().max(500).optional(),
  reference_url: z.string().url().optional().or(z.literal('')),
  reference_files: z.array(z.object({
    url: z.string().url(),
    name: z.string(),
    size: z.number(),
  })).optional(),
});

export const feedbackSchema = z.object({
  commission_name: z.string().min(1, 'Commission name is required').max(100),
  email: z.string().email('Invalid email'),
  feedback_round: z.number().int().min(1).max(5),
  locale: z.enum(['en', 'ja', 'zh']),
  issues: z.array(issueSchema).min(1, 'Please add at least one issue'),
});

export type FeedbackInput = z.infer<typeof feedbackSchema>;
export type IssueInput = z.infer<typeof issueSchema>;
