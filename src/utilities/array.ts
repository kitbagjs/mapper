export function asArray<T>(value: T | T[] | readonly T[]): T[] {
  if (Array.isArray(value)) {
    return value
  }

  return [value as T]
}
