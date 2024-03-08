# @kitbag/mapper

A simple and versatile mapping utility for Typescript.

## Get Started

```bash
npm i --save @kitbag/mapper
```

## Basic Setup

Each mapper relies an an underlying set of `Profile` objects to define what types are supported and how to map between them. Mappers are created with `createMapper` function, which takes `Profile[]` as it's only argument.

```ts
import { createMapper } from '@stackoverfloweth/mapper'

const mapper = createMapper(profiles)

mapper.map('source-key', source, 'destination-key')
```

### Profiles

Each profile defines a value for `sourceKey` and `destinationKey`. These keys must extend `string` and should be unique, beyond that the choice is irrelevant to the function of the mapper.

Here are a couple simple examples of `Profile` objects

```ts
export const numberToString = {
  sourceKey: 'number',
  destinationKey: 'string',
  map: (source: number): string => {
    return source.toString()
  },
} as const satisfies Profile

export const numberToDate = {
  sourceKey: 'number',
  destinationKey: 'Date',
  map: (source: number): Date => {
    return new Date(source)
  },
} as const satisfies Profile
```

The mapper will use the keys you define to provide type safety when calling map.

```ts
mapper.map('number', 123, 'string') // "123"
mapper.map('number', 123, 'Date')   // Wed Dec 31 1969...
mapper.map('number', 123, 'potato') // ERROR TS:2345 Argument of type '"potato"' is not assignable to parameter of type '"string" | "Date"'
```

Anytime `mapper.map` is called with source and/or destination keys that are not registered by a profile, it will throw the following error.

> 'Mapping profile not found'

### Loading profiles automatically

This library provides a useful method for automatically loading profiles. If you store all of your profiles in the same folder with a simple barrel file.

```text
└── src
   ├── models
   └── maps
      ├── primitives.ts
      ├── foo.ts
      ├── bar.ts
      └── index.ts
```

```ts
import { createMapper, loadProfiles } from '@kitbag/mapper'
import * as maybeProfiles from '@/maps'

const profiles = loadProfiles(maybeProfiles)

const mapper = createMapper(profiles)
```

### Mapping an array

Because `TSource` and `TDestination` are not constrained, you can always define a profile that expects an array.

```ts
export const numbersArrayToNumbersSet = {
  sourceKey: 'array',
  destinationKey: 'Set',
  map<T>: (source: T[]): Set<T> => {
    return new Set<T>(source)
  },
} as const satisfies Profile
```

However, if your goal is use the same mapping profile over an array of sources you can use either

```ts
const mapped = sources.map(source => mapper.map('source-key', source, 'destination-key'))
```

or the mapper provides a simpler method `mapMany`, which takes an array of `TSource` and returns an array `TDestination`.

```ts
const mapped = mapper.mapMany('source-key', sources, 'destination-key')
```

### Nesting profiles

Sometimes your business logic for mapping from `TSource` to `TDestination` might benefit from nesting profiles inside of other profiles. For example, if you have the following models

```ts
// src/models/order.ts

export type Order = {
  orderId: string,
  total: number,
  items: Item[],
}
```

```ts
// src/models/item.ts

export type Item = {
  itemId: string,
  title: string,
  description: string,
}
```

and you need to map from api models

```ts
// src/models/api/orderResponse.ts

export type OrderResponse = {
  _id: ObjectId,
  totalInPennies: number,
  items?: ItemResponse[],
}
```

```ts
// src/models/api/itemResponse.ts

export type ItemResponse = {
  _id: ObjectId,
  title: string,
  description?: string,
}
```

There are a couple opportunities to use the mapper from within the order profile. Both the `ObjectId` from mongodb and `Item` mapping logic is likely already encapsulated by another profile. The same `mapper` can be imported and used within a Profile.

```ts
export const orderResponseToOrder = {
  sourceKey: 'OrderResponse',
  destinationKey: 'Order',
  map: (source: OrderResponse): Order => {
    return {
      orderId: mapper.map('ObjectId', source._id, 'string'),
      total: number,
      items: mapper.map('ItemResponse', source.items ?? [], 'Item'),
    }
  },
} as const satisfies Profile
```

## Notes

### Profile name

What you chose to name the profile doesn't matter to the mapper. In these examples I used the pattern `${sourceKey}To${destinationKey}` but this key is not currently used by `loadProfiles()` in any way.

### Implicit `any` TS error

If you're seeing the following error within your profile or within the file that calls `createMapper`

> '...' implicitly has type 'any' because it does not have a type annotation and is referenced directly or indirectly in its own initializer.

this is likely because you're missing the type annotations on your `map` method within a profile.

```ts
export const numberToString = {
  sourceKey: 'number',
  destinationKey: 'string',
  map: (source) => {
    return source.toString()
  },
} as const satisfies Profile
```

adding `number` type for `source` and return type of `string` resolves the error.

```ts
export const numberToString = {
  sourceKey: 'number',
  destinationKey: 'string',
  map: (source: number): string => {
    return source.toString()
  },
} as const satisfies Profile
```
