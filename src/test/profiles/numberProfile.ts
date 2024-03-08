import { Profile } from '@/types'

export const numberToString = {
  sourceKey: 'number',
  destinationKey: 'string',
  map: (source: number): string => source.toLocaleString(),
} as const satisfies Profile