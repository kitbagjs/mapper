// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface Profile<TSourceKey extends string = string, TSource = any, TDestinationKey extends string = string, TDestination = any> {
  sourceKey: TSourceKey,
  destinationKey: TDestinationKey,
  map: (source: TSource) => TDestination,
}

export type ProfileKey<T extends Profile> = `${T['sourceKey']}-${T['destinationKey']}`

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ExtractSourceKeys<TProfile> = TProfile extends Profile<infer TSourceKey, any, any> ? TSourceKey : never

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ExtractSources<TProfile, TKey extends ExtractSourceKeys<TProfile>> = TProfile extends Profile<TKey, infer TSource, any> ? TSource : never

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ExtractDestinationKeys<TProfile, TSourceKey extends ExtractSourceKeys<TProfile>> = TProfile extends Profile<TSourceKey, any, infer TDestinationKey> ? TDestinationKey : never

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ExtractDestinations<TProfile, TSourceKey extends ExtractSourceKeys<TProfile>, TDestinationKey extends ExtractDestinationKeys<TProfile, TSourceKey>> = TProfile extends Profile<TSourceKey, any, TDestinationKey, infer TDestination> ? TDestination : never
