import { Profiles } from '@/types'

export const numberProfiles = [
  {
    sourceKey: 'number',
    destinationKey: 'string',
    map: function(source: number): string {
      return source.toString()
    },
  },
] as const satisfies Profiles
