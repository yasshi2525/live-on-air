export const isError = (obj: unknown): obj is Error =>
  obj != null && typeof obj === 'object' && 'message' in obj && typeof obj.message === 'string'
