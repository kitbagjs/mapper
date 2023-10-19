type AnyMapper = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  map: (sourceKey: any, source: any, destinationKey: any) => any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mapMany: (sourceKey: any, sourceArray: any[], destinationKey: any) => any[],
}

export interface Profile<TSourceKey extends string, TSource, TDestinationKey extends string, TDestination> {
  sourceKey: TSourceKey,
  destinationKey: TDestinationKey,
  map: (source: TSource, mapper: AnyMapper) => TDestination,
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyProfile = Profile<string, any, string, any>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ExtractSourceKeys<TProfile> = TProfile extends Profile<infer TSourceKey, any, any, any> ? TSourceKey : never

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ExtractSources<TProfile, TKey extends ExtractSourceKeys<TProfile>> = TProfile extends Profile<TKey, infer TSource, any, any> ? TSource : never

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ExtractDestinationKeys<TProfile, TSourceKey extends ExtractSourceKeys<TProfile>> = TProfile extends Profile<TSourceKey, any, infer TDestinationKey, any> ? TDestinationKey : never

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ExtractDestinations<TProfile, TSourceKey extends ExtractSourceKeys<TProfile>, TDestinationKey extends ExtractDestinationKeys<TProfile, TSourceKey>> = TProfile extends Profile<TSourceKey, any, TDestinationKey, infer TDestination> ? TDestination : never
