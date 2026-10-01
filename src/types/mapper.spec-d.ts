import { expectTypeOf, test } from 'vitest'
import { Mapper } from '@/types/mapper'
import { Profile } from '@/types/profile'

declare const broadSourceMapper: Mapper<[
  Profile<string, number, 'x', string>,
  Profile<'a', string, 'y', boolean>
]>

declare const broadSourceKey: string

test('broad source keys do not expose destinations from unrelated profiles', () => {
  // @ts-expect-error Only source a has destination y.
  broadSourceMapper.map('b', 'hello', 'y')
  // @ts-expect-error Only source a has destination y.
  broadSourceMapper.mapMany('b', ['hello'], 'y')

  expectTypeOf(broadSourceMapper.map('a', 'hello', 'y')).toEqualTypeOf<boolean>()
  expectTypeOf(broadSourceMapper.mapMany('a', ['hello'], 'y')).toEqualTypeOf<boolean[]>()
  expectTypeOf(broadSourceMapper.map(broadSourceKey, 1, 'x')).toEqualTypeOf<string>()
  expectTypeOf(broadSourceMapper.mapMany(broadSourceKey, [1], 'x')).toEqualTypeOf<string[]>()

  // @ts-expect-error Destination y expects a string input.
  broadSourceMapper.map('a', 1, 'y')
  // @ts-expect-error Destination y expects string inputs.
  broadSourceMapper.mapMany('a', [1], 'y')
})

declare const literalMapper: Mapper<[
  Profile<'a', number, 'x', string>,
  Profile<'a', string, 'y', Promise<boolean>>,
  Profile<'b', number, 'x', boolean>
]>

declare const unionSourceKey: 'a' | 'b'

test('literal and union keys retain their mapping results', () => {
  expectTypeOf(literalMapper.map('a', 1, 'x')).toEqualTypeOf<string>()
  expectTypeOf(literalMapper.map('a', 'hello', 'y')).toEqualTypeOf<Promise<boolean>>()
  expectTypeOf(literalMapper.mapMany('a', ['hello'], 'y')).toEqualTypeOf<Promise<boolean>[]>()
  expectTypeOf(literalMapper.map(unionSourceKey, 1, 'x')).toEqualTypeOf<string | boolean>()
  expectTypeOf(literalMapper.mapMany(unionSourceKey, [1], 'x')).toEqualTypeOf<(string | boolean)[]>()

  // @ts-expect-error Source b has no destination y.
  literalMapper.map('b', 'hello', 'y')
  // @ts-expect-error Destination x expects a number input.
  literalMapper.map('a', 'hello', 'x')
})
