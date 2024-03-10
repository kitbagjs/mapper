import { ExtractSourceKeys, ExtractSources, ExtractDestinationKeys, ExtractDestinations, Profile } from '@/types/profile'

export type Mapper<TProfiles extends Readonly<Profile[]>, TProfile = TProfiles[number]> = {
  register: (profiles: Profile[] | Readonly<Profile[]>) => void,
  map: <
    TSourceKey extends ExtractSourceKeys<TProfile>,
    TSource extends ExtractSources<TProfile, TSourceKey>,
    TDestinationKey extends ExtractDestinationKeys<TProfile, TSourceKey>,
    TDestination extends ExtractDestinations<TProfile, TSourceKey, TDestinationKey>
  > (sourceKey: TSourceKey, source: TSource, destinationKey: TDestinationKey) => TDestination,
  mapMany: <
    TSourceKey extends ExtractSourceKeys<TProfile>,
    TSource extends ExtractSources<TProfile, TSourceKey>,
    TDestinationKey extends ExtractDestinationKeys<TProfile, TSourceKey>,
    TDestination extends ExtractDestinations<TProfile, TSourceKey, TDestinationKey>
  > (sourceKey: TSourceKey, sourceArray: TSource[], destinationKey: TDestinationKey) => TDestination[],
}