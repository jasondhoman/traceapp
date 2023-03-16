import * as z from 'zod';

export const Certification = z.object({
  id: z.number().optional(),
  certification: z.string().min(1),
  description: z.string().nullable(),
});

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type Certification = z.infer<typeof Certification>;
