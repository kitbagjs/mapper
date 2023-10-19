type AnyMapper = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  map: (sourceKey: any, source: any, destinationKey: any) => any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mapMany: (sourceKey: any, sourceArray: any[], destinationKey: any) => any[],
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Profile<TSourceKey = string, TSource = any, TDestinationKey = string, TDestination = any> = {
  sourceKey: TSourceKey,
  destinationKey: TDestinationKey,
  map: (source: TSource, mapper: AnyMapper) => TDestination,
}

export type ProfileSource<TProfile extends Profile> = Parameters<TProfile['map']>[0]
export type ProfileDestination<TProfile extends Profile> = ReturnType<TProfile['map']>