import { createHash } from 'crypto'

/**
 * Hashes a string value using SHA-256 algorithm.
 * Used for hashing user data before sending to Facebook Conversion API.
 * @param value - The string to hash
 * @returns The hashed string in lowercase
 */
export async function hash(value: string): Promise<string> {
  return createHash('sha256').update(value.trim().toLowerCase()).digest('hex')
}
