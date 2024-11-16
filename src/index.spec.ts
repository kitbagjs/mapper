import { expect, test } from 'vitest'
import mapper from '@/index'
import { Profile, ProfileNotFoundError } from '@/types'

const stringToBoolean = {
  sourceKey: 'string',
  destinationKey: 'boolean',
  map: (source: string): boolean => Boolean(source),
} as const satisfies Profile

const profiles = [stringToBoolean]

// declare module '@/index' {
//   interface Register {
//     profiles: typeof profiles,
//   }
// }

mapper.register(profiles)

test('when types are provided via register interface, gets enforced when calling map and throws exception', () => {
  const error = new ProfileNotFoundError('x', 'x')

  // if Register is not commented out >> @ts-expect-error 'x' is not registered SourceKey
  const action: () => void = () => {
    mapper.map('x', 'x', 'x')
  }

  expect(action).toThrow(error)
})
