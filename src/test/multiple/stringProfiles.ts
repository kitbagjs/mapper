import { Profiles } from '@/types'

export const stringProfiles = [
  {
    sourceKey: 'string',
    destinationKey: 'boolean',
    map: function(source: string): boolean {
      return source === 'true'
    },
  },
  {
    sourceKey: 'string',
    destinationKey: 'Date',
    map: function(source: string): Date {
      return new Date(source)
    },
  },
] as const satisfies Profiles