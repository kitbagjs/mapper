import { expect, test } from 'vitest'
import { createMapper } from '@/createMapper'
import { mapper } from '@/index'
import { ProfileNotFoundError } from '@/profileNotFoundError'
import { Profile } from '@/types'

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

test('throws error if profile is not found', () => {
  const error = new ProfileNotFoundError('x', 'x')

  expect(() => mapper.map('x', 'x', 'x')).toThrowError(error)
})