export function asArray<T>(value: T | T[] | Readonly<T[]>): T[] {
  if (Array.isArray(value)) {
    return value
  }

  return [value as T]
}