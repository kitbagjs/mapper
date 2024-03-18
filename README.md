# @kitbag/mapper

[![Netlify Status](https://api.netlify.com/api/v1/badges/d6033c76-88c3-4963-b24f-7a0bda20f271/deploy-status)](https://app.netlify.com/sites/kitbag-mapper/deploys)

A simple and versatile mapping utility for Typescript.

Get started with the [documentation](https://kitbag-mapper.netlify.app/)

## Get Started

```bash
# bun
bun add @kitbag/mapper
# yarn
yarn add @kitbag/mapper
# npm
npm install @kitbag/mapper
```

## Basic Setup

```ts
import mapper from '@kitbag/mapper'

const profiles = [
  createProfile('number', 'string', (source: number): boolean => source.toString())
  createProfile('number', 'Date', (source: number): Date =>new Date(source))
]

mapper.register(profiles)

const dateValue = mapper.map('number', 123, 'Date') // Wed Dec 31 1969...
```

Kitbag Mapper relies an an underlying set of `Profile` objects to define what types are supported and how to map between them. To add profiles to Kitbag Mapper, use `register`.

### Type Safety

In order to have type safety when using Kitbag Mapper, you must register your profiles within the `Register` interface under the namespace `@kitbag/mapper`.

```ts
declare module '@kitbag/mapper' {
  interface Register {
    profiles: typeof profiles
  }
}
```

## Profiles

Each profile defines a value for `sourceKey` and `destinationKey`. These keys must extend `string` and should be unique, beyond that the choice is irrelevant to the function of Kitbag Mapper.

Profiles can be created with the `createProfile` function, which takes 3 arguments

| Argument  | Type |
| ------------- | ------------- |
| SourceKey  | `string`  |
| DestinationKey  | `string`  |
| MapFunction  | `(source: TSource) => TDestination`  |

```ts
import { createProfile } from '@kitbag/mapper'

createProfile('number', 'string', (source: number): boolean => source.toString())
```

Alternatively, you can define profiles directly by using the `Profile` type. 

```ts
import { Profile } from '@kitbag/mapper'

const numberToString = {
  sourceKey: 'number',
  destinationKey: 'string',
  map: (source: number): string => {
    return source.toString()
  },
} as const satisfies Profile,
```

or together in an array

```ts
import { Profile } from '@kitbag/mapper'

export const profiles = [
  {
    sourceKey: 'number',
    destinationKey: 'string',
    map: (source: number): string => {
      return source.toString()
    },
  },
  {
    sourceKey: 'number',
    destinationKey: 'Date',
    map: (source: number): Date => {
      return new Date(source)
    },
  }
] as const satisfies Readonly<Profile[]>
```

Note the [satisfies operator](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.html#the-satisfies-operator) requires Typescript v4.9+.

Assuming you declared your own `Register` interface from [Type Safety](#type-safety). Kitbag Mapper will use the keys you define to provide type safety when calling map.

```ts
mapper.map('number', 123, 'string') // "123"
mapper.map('number', 123, 'Date')   // Wed Dec 31 1969...
mapper.map('number', 123, 'potato') // ERROR TS:2345 Argument of type '"potato"' is not assignable to parameter of type '"string" | "Date"'
```

### ProfileNotFoundError

Anytime `mapper.map` is called with source and/or destination keys that are not registered by a profile, it will throw `ProfileNotFoundError`.

## Loading profiles automatically

This library provides a useful method for automatically loading profiles. If you store all of your profiles in the same folder with a simple [barrel file](https://github.com/basarat/typescript-book/blob/master/docs/tips/barrel.md).

```text
└── src
   └── maps
      ├── foo.ts
      ├── bar.ts
      ├── index.ts
      └── primitives
        ├── string.ts
        ├── number.ts
        ├── boolean.ts
        └── index.ts
```

```ts
import mapper, { loadProfiles } from '@kitbag/mapper'
import * as profilesToLoad from '@/maps'

const profiles = loadProfiles(profilesToLoad)

mapper.register(profiles)
```

### ProfileTypeError

With most use cases involving an import that is not type safe, it's not unreasonable to assume something that doesn't satisfy `Profile` will get passed in. If `loadProfiles` is provided with anything that doesn't satisfy `Profile`, it will throw `ProfileTypeError`.

## Mapping an array

Because `TSource` and `TDestination` are not constrained, you can always define a profile that expects an array.

```ts
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
const mapped = sources.map(source => mapper.map('source-key', source, 'destination-key'))
```

or Kitbag Mapper provides a simpler method `mapMany`, which takes an array of `TSource` and returns an array `TDestination`.

```ts
const mapped = mapper.mapMany('source-key', sources, 'destination-key')
```

## Nesting profiles

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

There are a couple opportunities to use Kitbag Mapper from within the order profile. Both the `ObjectId` from mongodb and `Item` mapping logic is likely already encapsulated by another profile. The same `mapper` can be imported and used within a Profile.

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

What you chose to name the profile doesn't matter to Kitbag Mapper. In these examples we used the pattern `${sourceKey}To${destinationKey}` but this key is not currently used by `loadProfiles()` in any way.

### Missing types or source type `never`

If you're seeing map as `(sourceKey: string, source: unknown, destinationKey: string) => unknown`, this likely means you missed setting the `Register` interface. See more about [type safety](#type-safety).

This could also be the result of your profiles not using `as const satisfies Profile`.

```ts
export const numberToString = {
  sourceKey: 'number',
  destinationKey: 'string',
  map: (source) => {
    return source.toString()
  },
} as const satisfies Profile
```
