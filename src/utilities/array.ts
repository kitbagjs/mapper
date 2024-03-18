export function asArray<T>(value: T | T[] | Readonly<T[]>): T[] {
  if (Array.isArray(value)) {
    return value
  }

  return [value as T]
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function flatten(array: any[]): any[] {
  return array.flatMap(value => Array.isArray(value) ? flatten(value) : value)
}