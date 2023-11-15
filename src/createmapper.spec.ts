import { expect, test } from 'vitest'
import { createMapper } from '@/createMapper'
import { ProfileNotFoundError } from '@/profileNotFoundError'
import { Profile } from '@/types'

const stringToBoolean = {
  sourceKey: 'string',
  destinationKey: 'boolean',
  map: (source: string): boolean => Boolean(source),
} as const satisfies Profile

const mapper = createMapper([stringToBoolean])

test('map returns the correct value', () => {
  const value = mapper.map('string', 'true', 'boolean')

  expect(value).toBe(true)
})

test('mapMany returns the correct value', () => {
  const value = mapper.mapMany('string', ['true'], 'boolean')

  expect(value).toMatchObject([true])
})

test('throws error if profile is not found', () => {
  const mapper = createMapper([])
  const error = new ProfileNotFoundError('x', 'x')

  // @ts-expect-error because profile does not exist
  expect(() => mapper.map('x', 'x', 'x')).toThrowError(error)
})