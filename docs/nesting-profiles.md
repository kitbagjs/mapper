# Nesting Profiles

On the previous page we defined a profile for mapping between a server model and a frontend model. One of the properties of that model was `id`, which coming from the server is of type `ObjectId` from mongodb, as well as `created_date`, which needs to be instantiated as a `Date`. We executing these mappings inline, but let's say we wanted to extract these into it's their own profiles.

::: code-group

```ts [maps/ObjectId.ts]
import { Profile } from '@kitbag/mapper'
import { ObjectId } from 'mongodb'

export const objectIdToString = {
  sourceKey: 'ObjectId',
  destinationKey: 'string',
  map: (source: ObjectId): string => {
    return source.toString()
  },
} as const satisfies Profile
```

```ts [maps/Date.ts]
import { Profile } from '@kitbag/mapper'

export const stringToDate = {
  sourceKey: 'string',
  destinationKey: 'Date',
  map: (source) => {
    return new Date(source)
  },
} as const satisfies Profile
```

:::

With these profiles extracted, we can use it in all of our other profiles that have `id: ObjectId`

```ts [maps/user.ts]
import mapper, { Profile } from '@kitbag/mapper'
import { UserApiResponse, User } from '@/types'

export const userApiResponseToUser = {
  sourceKey: 'UserApiResponse',
  destinationKey: 'User',
  map: (source: UserApiResponse): User => {
    return {
      id: source.id.toString(), // [!code --]
      id: mapper.map('ObjectId', source.id, 'string'), // [!code ++]
      email: source.email_address,
      isActive: source.is_active,
      createdDate: new Date(source.created_date), // [!code --]
      createdDate: mapper.map('string', source.created_date, 'Date'), // [!code ++]
    }
  },
} as const satisfies Profile
```
