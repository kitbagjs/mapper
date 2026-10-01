// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface Profile<TSourceKey extends string = string, TSource = any, TDestinationKey extends string = string, TDestination = any> {
  sourceKey: TSourceKey,
  destinationKey: TDestinationKey,
  map: (source: TSource) => TDestination,
}

export type ProfileKey<T extends Profile> = `${T['sourceKey']}-${T['destinationKey']}`

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ExtractSourceKeys<TProfile> = TProfile extends Profile<infer TSourceKey, any, any> ? TSourceKey : never

export type Profiles = readonly Profile[]
