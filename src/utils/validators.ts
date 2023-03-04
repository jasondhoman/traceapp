import { AnyZodObject, ZodError } from 'zod';

export async function validateRequest(
  validators: AnyZodObject,
  body: any
): Promise<object | ZodError> {
  try {
    body = await validators.parseAsync(body);
  } catch (error) {
    if (error instanceof ZodError) {
      return error;
    }
  }
  return body;
}
