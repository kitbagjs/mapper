# Debugging

## ProfileNotFoundError

Anytime `mapper.map` is called with source and/or destination keys that are not registered by a profile, it will throw `ProfileNotFoundError`.  

- Make sure your profile exists and is property [registered](./getting-started.md#register-the-profiles).

## ProfileTypeError

Anytime `loadProfiles` is called with an import that includes anything that doesn't satisfy `Profile`, it will throw `ProfileTypeError`.  

- Make sure your barrel file only includes files you expect
- Make sure your only exporting profiles from within map files
- Make sure each profile uses `as const satisfies Profile`

## ProfileMappingError

When the mapper is executing `map` function on a given profile, it wraps the call in a try catch. If that function throws an exception for any reason it is wrapped in a `ProfileMappingError`. This provides additional context to the end application where an error is taking place and inside of which specific profile to investigate.

## Missing types or source type never

If you hover `mapper.map` and see

> (sourceKey: string, source: unknown, destinationKey: string) => unknown

This likely means you missed setting the `Register` interface. See more about [registering](./getting-started.md#register-the-profiles).

This could also be the result of your profiles not using `as const satisfies Profile`.

```ts
export const numberToString = {
  sourceKey: 'number',
  destinationKey: 'string',
  map: (source) => {
    return source.toString()
  },
} as const satisfies Profile // [!code focus]
```
