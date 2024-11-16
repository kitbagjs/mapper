import { expectTypeOf, test } from 'vitest'
import { loadProfiles } from '@/loadProfiles'
import * as includesMultiple from '@/test/includesMultiple'
import * as loadedProfileArrays from '@/test/multiple'
import * as loadedProfiles from '@/test/profiles'

test('when using * import with files that are profile arrays, returns typed Profile[]', () => {
  const profiles = loadProfiles(includesMultiple)

  type ExpectedType = readonly (
    | typeof loadedProfiles['numberToString']
    | typeof loadedProfiles['stringToBoolean']
    | typeof loadedProfileArrays['indexProfiles'][number]
    | typeof loadedProfileArrays['numberProfiles'][number]
    | typeof loadedProfileArrays['stringProfiles'][number]
  )[]

  expectTypeOf(profiles).toMatchTypeOf<ExpectedType>()
})
