# Loading Profiles

If you store all of your profiles in the same folder with a simple [barrel file](https://github.com/basarat/typescript-book/blob/master/docs/tips/barrel.md).

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

Kitbag Mapper provides an easy way to to automatically loading profiles in this directory.

```ts
import mapper, { loadProfiles } from '@kitbag/mapper'
import * as profilesToLoad from '@/maps'

const profiles = loadProfiles(profilesToLoad)

mapper.register(profiles)

declare module '@kitbag/mapper' {
  interface Register {
    profiles: typeof profiles
  }
}
```

## ProfileTypeError

With imports like this, it's reasonable to assume something that doesn't satisfy Profile might accidentally get included. If `loadProfiles` is provided with anything that doesn't satisfy `Profile`, it will throw `ProfileTypeError`.
