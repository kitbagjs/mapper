import { ExtractSourceKeys, ExtractSources, ExtractDestinationKeys, ExtractDestinations, Profile } from '@/types/profile'

export type Mapper<TProfiles extends readonly Profile[], TProfile = TProfiles[number]> = {
  register: (profiles: Profile[] | readonly Profile[] | Profile) => void,
  clear: () => void,
  has: (sourceKey: string, destinationKey: string) => boolean,
  map: <
    TSourceKey extends ExtractSourceKeys<TProfile>,
    TDestinationKey extends ExtractDestinationKeys<TProfile, TSourceKey>
  > (sourceKey: TSourceKey, source: ExtractSources<TProfile, TSourceKey>, destinationKey: TDestinationKey) => ExtractDestinations<TProfile, TSourceKey, TDestinationKey>,
  mapMany: <
    TSourceKey extends ExtractSourceKeys<TProfile>,
    TDestinationKey extends ExtractDestinationKeys<TProfile, TSourceKey>
  > (sourceKey: TSourceKey, sourceArray: ExtractSources<TProfile, TSourceKey>[], destinationKey: TDestinationKey) => ExtractDestinations<TProfile, TSourceKey, TDestinationKey>[],
}
