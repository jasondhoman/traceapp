/* eslint-disable @typescript-eslint/no-redeclare */
import { z } from 'zod';

export const ServerConfigSchema = z.object({
  VITE_API_ROOT: z.string().trim().min(1),
  VITE_API_DEV_ROOT: z.string().trim().nullable(),
  VITE_DATA_TOKEN: z.string().trim().min(1),
  VITE_STAGING: z.coerce.boolean().default(false),
  // NODE_ENV: z.string().trim().min(1),
});

export type ServerConfigSchema = z.infer<typeof ServerConfigSchema>;

export const config = ServerConfigSchema.parse(import.meta.env);
