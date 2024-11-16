import { expect, test } from 'vitest'
import { loadProfiles } from '@/loadProfiles'
import * as includesMultiple from '@/test/includesMultiple'
import * as includesNotProfile from '@/test/includesNotProfile'
import * as loadedProfileArrays from '@/test/multiple'
import * as loadedProfiles from '@/test/profiles'
import { ProfileTypeError } from '@/types'

test('when using * import with files that are not profiles, throws exception', () => {
  const action: () => void = () => loadProfiles(includesNotProfile)

  expect(action).toThrow(ProfileTypeError)
})

test('when using * import with files that are profiles, returns typed Profile[]', () => {
  const profiles = loadProfiles(loadedProfiles)
  const { numberToString, stringToBoolean } = loadedProfiles

  expect(profiles).toMatchObject([numberToString, stringToBoolean])
})

test('when using * import with files that are profile arrays, returns typed Profile[]', () => {
  const profiles = loadProfiles(includesMultiple)
  const { numberToString, stringToBoolean } = loadedProfiles
  const { indexProfiles, numberProfiles, stringProfiles } = loadedProfileArrays

  expect(profiles).toMatchObject([...numberProfiles, ...stringProfiles, ...indexProfiles, numberToString, stringToBoolean])
})
