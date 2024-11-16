import { expectTypeOf, test } from 'vitest'
import { Profile, createProfile } from '@/index'

test('types always map correctly', () => {
  const sourceKey = 'source'
  type SourceKey = typeof sourceKey
  const destinationKey = 'destination'
  type DestinationKey = typeof destinationKey
  const map: () => boolean = () => true

  const profile = createProfile(sourceKey, destinationKey, map)

  expectTypeOf(profile).toEqualTypeOf<Profile<SourceKey, undefined, DestinationKey, boolean>>()
})
