import { expectTypeOf, test } from 'vitest'
import { loadProfiles } from '@/loadProfiles'
import * as includesMultiple from '@/test/includesMultiple'
import * as loadedProfileArrays from '@/test/multiple'
import * as loadedProfiles from '@/test/profiles'


test('when using * import with files that are profile arrays, returns typed Profile[]', () => {
  const { numberToString, stringToBoolean } = loadedProfiles
  const { indexProfiles, numberProfiles, stringProfiles } = loadedProfileArrays
  const profiles = loadProfiles(includesMultiple)

  type ExpectedType = readonly (
    | typeof numberToString
    | typeof stringToBoolean
    | typeof indexProfiles[number]
    | typeof numberProfiles[number]
    | typeof stringProfiles[number]
  )[]

  expectTypeOf(profiles).toMatchTypeOf<ExpectedType>()
})