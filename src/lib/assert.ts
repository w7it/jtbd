/**
 * Error for data that is required but not present
 * @see assert
 */
export class AssertionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AssertionError";
  }
}

/**
 * Verifying invariants
 * @param value - The input that is checked for being truthy
 * @param message - Message of error if assertion will be failed
 * @param extra - Extra payload that will be sent to Sentry as additional unsearchable data
 */
export function assert(value: unknown, message: string): asserts value {
  if (value) return;
  throw new AssertionError(message);
}
