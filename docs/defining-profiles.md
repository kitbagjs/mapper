# Defining Profiles

Each profile defines a value for `sourceKey` and `destinationKey`. These keys must extend `string` and should be unique combinations, beyond that the choice is irrelevant to the function of Kitbag Mapper.

Here is a simple example of a profile that converts a python server model you might see in an API service to the frontend model.

::: code-group

```ts [maps/user.ts]
import { Profile } from '@kitbag/mapper'
import { UserApiResponse, User } from '@/types'

export const userApiResponseToUser = {
  sourceKey: 'UserApiResponse',
  destinationKey: 'User',
  map: (source: UserApiResponse): User => {
    return {
      id: source.id.toString(),
      email: source.email_address,
      isActive: source.is_active,
      createdDate: new Date(source.created_date),
    }
  },
} as const satisfies Profile
```

```ts [types/UserApiResponse.ts]
import { ObjectId } from 'mongodb'

export type UserApiResponse = {
  id: ObjectId,
  email_address: string,
  is_active: boolean,
  created_date: string,
}
```

```ts [types/User.ts]
export type User = {
  id: string,
  email: string,
  isActive: boolean,
  createdDate: Date,
}
```

:::

The real magic happens inside of the `map` function of your profile. The types you define for the source argument and the the return type are what will ultimately provide the type safety when `mapper.map` is called.

## Satisfies Operator

Note the [satisfies operator](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.html#the-satisfies-operator) requires Typescript v4.9+.
