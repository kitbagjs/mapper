import { expect, test } from 'vitest'
import mapper from '@/index'
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