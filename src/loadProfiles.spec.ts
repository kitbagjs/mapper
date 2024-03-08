import { expect, test } from 'vitest'
import { loadProfiles } from '@/loadProfiles'
import * as loadedEverything from '@/test'
import * as loadedProfiles from '@/test/profiles'
import { ProfileTypeError } from '@/types'

test('when using * import with files that are not profiles, throws exception', () => {
  const action: () => void = () => loadProfiles(loadedEverything)

  expect(action).toThrow(ProfileTypeError)
})

test('when using * import with files that are profiles, returns typed Profile[]', () => {
  const profiles = loadProfiles(loadedProfiles)
  const { numberToString, stringToBoolean } = loadedProfiles

  expect(profiles).toMatchObject([numberToString, stringToBoolean])
})