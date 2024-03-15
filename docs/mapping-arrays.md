# Mapping Arrays

With the lack of constraints on `TSource` and `TDestination`, you can always provide a profile that expects or returns an array.

```ts
import { Profile } from '@kitbag/mapper'

export const arrayToSet = {
  sourceKey: 'array',
  destinationKey: 'Set',
  map: function <T>(source: T[]): Set<T> {
    return new Set<T>(source)
  },
} as const satisfies Profile
```

However, if your goal is use the same mapping profile over an array of sources you can use either

```ts
const mapped = [123, 456].map((source) => mapper.map('number', source, 'Date'))
```

or for an even simpler solution, Kitbag Mapper provides `mapMany`, which takes an array of `TSource` and returns an array of `TDestination`.

```ts
const mapped = mapper.mapMany('number', [123, 456], 'Date')
```
