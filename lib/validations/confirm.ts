import { z } from 'zod';

export const confirmSchema = z.object({
  commission_name: z.string().min(1).max(100),
  email: z.string().email(),
  locale: z.enum(['en', 'ja', 'zh']),
  debut_date_status: z.enum(['decided', 'undecided']),
  debut_date: z.string().date().optional(),
  additional_message: z.string().max(1000).optional(),
  confirmed: z.literal(true),
}).refine(
  (data) => data.debut_date_status === 'undecided' || !!data.debut_date,
  { message: 'Please select a date', path: ['debut_date'] }
);

export type ConfirmInput = z.infer<typeof confirmSchema>;
