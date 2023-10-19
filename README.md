# mapper

## Basic Setup

Each mapper relies an an underlying set of `Profile` objects to define what types are supported and how to map between them. Mappers are created with `createMapper` function, which takes `Profile[]` as it's only argument.

```ts
import { createMapper } from '@stackoverfloweth/mapper'

const mapper = createMapper(profiles)

mapper.map('source-key', source, 'destination-key')
```

### Profiles

Each profile defines a value for `sourceKey` and `destinationKey`. These keys must extend `string` and should be unique, beyond that the choice is irrelevant to the function of the mapper.

The heart of the profile is the `map` function, which has the following contract

```ts
map: (source: TSource, mapper: Mapper) => TDestination
```

Note the presence of the `mapper` argument serves as a utility the developer to nest profiles (read more about nesting profiles below).

Here are a couple simple examples of `Profile` objects

```ts
// example using the Profile type with generics
export const numberToString: Profile<'number', number, 'string', string> = {
  sourceKey: 'number',
  destinationKey: 'string',
  map: (source) => {
    return source.toString()
  },
}

// example using the profile type with as const satisfies
export const numberToDate = {
  sourceKey: 'number',
  destinationKey: 'Date',
  map: (source) => {
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
const profiles = await loadProfiles(() => import('src/maps'))

const mapper = createMapper(profiles)
```

### Mapping an array

Because `TSource` and `TDestination` are not constrained, you can always define a profile that expects an array.

```ts
export const numbersArrayToNumbersSet: Profile<'array', unknown[], 'Set', Set<unknown>> = {
  sourceKey: 'array',
  destinationKey: 'Set',
  map: (source) => {
    return new Set(source)
  },
}
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

There are a couple opportunities to use the mapper from within the order profile. Both the `ObjectId` from mongodb and `Item` mapping logic is likely already encapsulated by another profile. This is where the `mapper` argument provided to the profile `map` method comes in handy.

```ts
export const orderResponseToOrder: Profile<'OrderResponse', OrderResponse, 'Order', Order> = {
  sourceKey: 'OrderResponse',
  destinationKey: 'Order',
  map: (source, mapper) => {
    return {
      orderId: mapper.map('ObjectId', source._id, 'string'),
      total: number,
      items: mapper.map('ItemResponse', source.items ?? [], 'Item'),
    }
  },
}
```

However, there's a catch. Because the type safety is controlled by your application supplying the profiles to `createMapper`, the library itself cannot have an accurate type for `mapper` here. The type provided by default is `AnyMapper`, which unlike the mapper you get back from `createMapper` will have no constraints on keys or types.

The solution to this is to take advantage of ts duck typing by defining your own type for `MapFunction` that has narrowed types but still satisfies the requirement of `Profile.map`.

```ts

export const mapper = createMapper(profiles)
export type Mapper = typeof mapper

export type MapFunction<TSource, TDestination> = (source: TSource, mapper: Mapper) => TDestination
```

Now you can rewrite your order profile with type safety

```ts
import { MapFunction } from 'src/services'

const map: MapFunction<OrderResponse, Order> = (source, mapper) => {
  return {
    orderId: mapper.map('ObjectId', source._id, 'string'),
    total: number,
    items: mapper.map('ItemResponse', source.items ?? [], 'Item'),
  }
}

export const orderResponseToOrder: Profile<'OrderResponse', OrderResponse, 'Order', Order> = {
  sourceKey: 'OrderResponse',
  destinationKey: 'Order',
  map,
}
```

## Notes

- What you chose to name the profile doesn't matter to the mapper. In these examples I used the pattern `${sourceKey}To${destinationKey}` but this key is not currently used by `loadProfiles()` in any way.
