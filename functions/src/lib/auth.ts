import { HttpsError, type CallableRequest } from 'firebase-functions/v2/https'
import type { ZodType } from 'zod'

export function assertAuthenticated<T>(
  request: CallableRequest<T>,
): NonNullable<CallableRequest<T>['auth']> {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Must be signed in')
  }
  return request.auth
}

export function assertAdmin<T>(
  request: CallableRequest<T>,
): NonNullable<CallableRequest<T>['auth']> {
  const auth = assertAuthenticated(request)
  if (auth.token.role !== 'admin') {
    throw new HttpsError('permission-denied', 'Admin access required')
  }
  return auth
}

export function validate<T>(schema: ZodType<T>, data: unknown): T {
  const result = schema.safeParse(data)
  if (!result.success) {
    throw new HttpsError('invalid-argument', 'Invalid input', result.error.flatten())
  }
  return result.data
}
