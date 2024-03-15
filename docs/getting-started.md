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

### Define Some Profiles

We will cover profiles in greater depth soon, for now let's just write some simple examples.

```ts
import type { Profile } from '@kitbag/mapper'

const profiles = [
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
] as const satisfies Profile[]
```

Here we have (2) profiles, 1 that is responsible for mapping `number` to `string` and another for mapping `number` to a `Date` instance.

### Register the Profiles

Mapper is exported from `@kitbag/mapper` as a singleton so profiles must be registered before they can be used. 

```ts
import mapper from '@kitbag/mapper'

mapper.register(profiles)
```

In order for type safety to work, we must also update the `Register` interface accordingly

```ts
declare module '@kitbag/mapper' {
  interface Register {
    profiles: typeof profiles
  }
}
```

### Using the Mapper

Once you have profiles registered, using the mapper is quite simple

```ts
import mapper from '@kitbag/mapper'

mapper.map('number', 123, 'string') // "123"
mapper.map('number', 123, 'Date')   // Wed Dec 31 1969...
mapper.map('number', 123, 'potato') // ERROR TS:2345 Argument of type '"potato"' is not assignable to parameter of type '"string" | "Date"'
```
