# Getting Started

## Installation

Install Kitbag Mapper with your favorite package manager

```bash
# bun
bun add @kitbag/mapper
# yarn
yarn add @kitbag/mapper
# npm
npm install @kitbag/mapper
```

## Define Some Profiles

The guide will cover [defining profiles](/defining-profiles) in greater depth, for now let's just write some simple examples.

```ts
import type { Profile } from '@kitbag/mapper'

const profiles = [
  createProfile('number', 'string', (source: number): string => source.toString()),
  createProfile('number', 'Date', (source: number): Date => new Date(source)),
] as const
```

::: info Type Safety
Using `as const` when defining profiles is important as it ensures the types are correctly inferred.
:::

Here we have (2) profiles, 1 that is responsible for mapping `number` to `string` and another for mapping `number` to a `Date` instance.

## Register the Profiles

Kitbag Mapper exports a singleton instance of the mapper. This instance makes it easy to apply profiles automatically and always those profiles are available anywhere in your codebase.

```ts {2,8}
import type { Profile } from '@kitbag/mapper'
import mapper from '@kitbag/mapper'

const profiles = [
  ...
] as const

mapper.register(profiles)
```

### Type Safety for Global Profiles

In order for type safety to work, we must also update the `Register` interface. Kitbag Mapper uses [declaration merging](https://www.typescriptlang.org/docs/handbook/declaration-merging.html) to update the types for the singleton's profiles.

```ts
declare module '@kitbag/mapper' {
  interface Register {
    profiles: typeof profiles
  }
}
```

## Creating Mapper Instances

Alternatively, you can use `createMapper` to create a new instance of `Mapper`.

```ts {2,8}
import type { Profile } from '@kitbag/mapper'
import { createMapper } from '@kitbag/mapper'

const profiles = [
  ...
] as const

const mapper = createMapper(profiles)
```

## Using the Mapper

Once you have profiles registered, using the mapper is quite simple

```ts
import mapper from '@kitbag/mapper'

mapper.map('number', 123, 'string') // "123"
mapper.map('number', 123, 'Date')   // Wed Dec 31 1969...
mapper.map('number', 123, 'potato') // ERROR TS:2345 Argument of type '"potato"' is not assignable to parameter of type '"string" | "Date"'
```
