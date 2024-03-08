import { Profile } from '@/types'

export const stringToBoolean = {
  sourceKey: 'string',
  destinationKey: 'boolean',
  map: (source: string): boolean => Boolean(source),
} as const satisfies Profile