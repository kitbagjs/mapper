# Notes

## Profile Naming

What you chose to name the profile doesn't matter to the mapper. In this documentation, we used the pattern `${sourceKey}To${destinationKey}` but this is purely for your organization and is not currently used by Kitbag Mapper in any way.

## Simplifying Profiles

You might start to notice that authoring profiles can sometimes feel verbose. Especially if you're mapping models with a lot of properties.

::: code-group

```ts [maps/User.ts]
export const userApiResponseToUser = {
  sourceKey: 'UserApiResponse',
  destinationKey: 'User',
  map: function (source: UserApiResponse): User {
    return {
      id: source.id.toString(),
      createdDate: new Date(source.created_date),
      language: source.language,
      timezone: source.timezone,
      emailAddress: source.email_address,
      isActive: source.is_active,
      marketingEmails: source.marketing_emails,
      firstName: source.first_name,
      lastName: source.last_name,
      dateOfBirth: source.date_of_birth,
      phoneNumber: source.phone_number,
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
  language: string,
  timezone: string,
  marketing_emails: boolean,
  first_name: string,
  last_name: string,
  date_of_birth: Date,
  phone_number?: string,
}
```

```ts [types/User.ts]
export type User = {
  id: string,
  emailAddress: string,
  isActive: boolean,
  createdDate: Date,
  language: string,
  timezone: string,
  marketingEmails: boolean,
  firstName: string,
  lastName: string,
  dateOfBirth: Date,
  phoneNumber?: string,
}
```

:::

There are several ways you can simplify the profile for mapping between these types without sacrificing type safety.

### Spread Operator

there are a couple properties on these models that are the same property name and type, we could use a spread operator to include these

```ts
export const userApiResponseToUser = {
  sourceKey: 'UserApiResponse',
  destinationKey: 'User',
  map: function (source: UserApiResponse): User {
    return {
      ...source, // [!code ++]
      id: source.id.toString(),
      createdDate: new Date(source.created_date),
      language: source.language, // [!code --]
      timezone: source.timezone, // [!code --]      
      emailAddress: source.email_address,
      isActive: source.is_active,
      marketingEmails: source.marketing_emails,
      firstName: source.first_name,
      lastName: source.last_name,
      dateOfBirth: source.date_of_birth,
      phoneNumber: source.phone_number,
    }
  },
} as const satisfies Profile
```

While more concise, this solution also blindly copies properties including the snake cased properties or properties you don't care about to the new object which might not be desired.

### Converting Casing

Thanks to great libraries like [StringTs](https://github.com/gustavoguichard/string-ts), we can convert snake cased properties into camel cased properties automatically both at runtime and type levels. Leaving your profile only responsible for declaring the business logic that's unique.

```ts
import { camelKeys } from 'string-ts'

export const userApiResponseToUser = {
  sourceKey: 'UserApiResponse',
  destinationKey: 'User',
  map: function (source: UserApiResponse): User {
    return {
      ...camelKeys(source), // [!code ++]
      id: source.id.toString(),
      createdDate: new Date(source.created_date),
      language: source.language, // [!code --]
      timezone: source.timezone, // [!code --]      
      emailAddress: source.email_address, // [!code --]
      isActive: source.is_active, // [!code --]
      marketingEmails: source.marketing_emails, // [!code --]
      firstName: source.first_name, // [!code --]
      lastName: source.last_name, // [!code --]
      dateOfBirth: source.date_of_birth, // [!code --]
      phoneNumber: source.phone_number, // [!code --]
    }
  },
} as const satisfies Profile
```

### Bad Ideas

Avoid casting in your map function. This breaks type safety and will swallow potential errors when underlying models change.

```ts
import { camelCase } from 'string-ts'

export const userApiResponseToUser = {
  sourceKey: 'UserApiResponse',
  destinationKey: 'User',
  map: function (source: UserApiResponse): User {
    return someMagicUtil(source) as User
  },
} as const satisfies Profile
```
