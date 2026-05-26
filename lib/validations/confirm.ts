import { z } from 'zod';

export const confirmSchema = z.object({
  commission_name: z.string().min(1).max(100),
  email: z.string().email(),
  locale: z.enum(['en', 'ja', 'zh']),
  debut_date_status: z.enum(['decided', 'undecided']),
  // Allow null in addition to undefined — JSON serialisers commonly emit
  // null for cleared fields, and Zod's plain `.optional()` only accepts
  // undefined which made `undecided` submissions return 400.
  debut_date: z.string().date().nullable().optional(),
  additional_message: z.string().max(1000).nullable().optional(),
  confirmed: z.literal(true),
}).refine(
  (data) => data.debut_date_status === 'undecided' || !!data.debut_date,
  { message: 'Please select a date', path: ['debut_date'] }
);

export type ConfirmInput = z.infer<typeof confirmSchema>;
