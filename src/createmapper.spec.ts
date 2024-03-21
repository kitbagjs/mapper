import { expect, test } from 'vitest'
import mapper from '@/index'
import { Profile } from '@/types'
import { ProfileMappingError } from '@/types/profileMappingError'

const stringToBoolean = {
  sourceKey: 'string',
  destinationKey: 'boolean',
  map: (source: string): boolean => Boolean(source),
} as const satisfies Profile

mapper.register([stringToBoolean])

test('map returns the correct value', () => {
  const value = mapper.map('string', 'true', 'boolean')

  expect(value).toBe(true)
})

test('mapMany returns the correct value', () => {
  const value = mapper.mapMany('string', ['true'], 'boolean')

  expect(value).toMatchObject([true])
})

test('register works with single profile', () => {
  const singleProfile = {
    sourceKey: 'foo',
    destinationKey: 'bar',
    map: (source: string): boolean => Boolean(source),
  } as const satisfies Profile

  mapper.register(singleProfile)

  expect(mapper.has('foo', 'bar')).toBe(true)
})

test('when map function throws exception, wraps in ProfileMappingError', () => {
  const singleProfile = {
    sourceKey: 'foo',
    destinationKey: 'bar',
    map: () => {
      throw 'not implemented'
    },
  } as const satisfies Profile

  mapper.register(singleProfile)

  const action: () => void = () => mapper.map('foo', null, 'bar')

  expect(action).toThrow(ProfileMappingError)
})