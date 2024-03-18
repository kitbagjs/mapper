import { Profile } from '@/types'

export * from './numberProfiles'
export * from './stringProfiles'

export const indexProfiles = [
  {
    sourceKey: 'index',
    destinationKey: 'outdex',
    map: function(source: boolean): string {
      return source.toString()
    },
  },
] as const satisfies Readonly<Profile[]>