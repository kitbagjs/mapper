import { ExtractSourceKeys, ExtractSources, ExtractDestinationKeys, ExtractDestinations, Profile, GenericProfile } from '@/types/profile'

export type Mapper<T extends Profile> = {
  map: <
    TSourceKey extends ExtractSourceKeys<T>,
    TSource extends ExtractSources<T, TSourceKey>,
    TDestinationKey extends ExtractDestinationKeys<T, TSourceKey>,
    TDestination extends ExtractDestinations<T, TSourceKey, TDestinationKey>
  > (sourceKey: TSourceKey, source: TSource, destinationKey: TDestinationKey) => TDestination,
  mapMany: <
    TSourceKey extends ExtractSourceKeys<T>,
    TSource extends ExtractSources<T, TSourceKey>,
    TDestinationKey extends ExtractDestinationKeys<T, TSourceKey>,
    TDestination extends ExtractDestinations<T, TSourceKey, TDestinationKey>
  > (sourceKey: TSourceKey, sourceArray: TSource[], destinationKey: TDestinationKey) => TDestination[],
}

export type GenericMapper = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  map: (sourceKey: string, source: any, destinationKey: string) => any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mapMany: (sourceKey: string, sourceArray: any[], destinationKey: string) => any[],
}

export interface Register {
  // mapper: Mapper
}

export type RegisteredMapper = Register extends { mapper: infer TMapper }
  ? TMapper
  : GenericMapper