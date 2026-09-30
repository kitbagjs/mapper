import { ExtractSourceKeys, Profile } from '@/types/profile'

/**
 * Registered profiles grouped once by source key, then destination key, so each `map` call is two
 * property lookups rather than a fresh pass over every registered profile.
 */
type ProfileIndex<TProfile> = {
  [TSourceKey in ExtractSourceKeys<TProfile>]: {
    [TMatch in Extract<TProfile, { sourceKey: TSourceKey }> as TMatch extends Profile ? TMatch['destinationKey'] : never]: TMatch
  }
}

/** Extracts the source type from a profile. `unknown` for the destination parameter matches any profile regardless of its destination type. */
type ProfileSource<TProfile> = TProfile extends Profile<string, infer TSource, string, unknown> ? TSource : never

/** Extracts the destination type from a profile. `never` for the source parameter exploits contravariance — any concrete source type satisfies `never extends TSource` in the function position, so the match is unconditional. */
type ProfileDestination<TProfile> = TProfile extends Profile<string, never, string, infer TDestination> ? TDestination : never

export type Mapper<TProfiles extends readonly Profile[], TProfile = TProfiles[number]> = {
  register: (profiles: Profile[] | readonly Profile[] | Profile) => void,
  clear: () => void,
  has: (sourceKey: string, destinationKey: string) => boolean,
  map: <
    TSourceKey extends keyof ProfileIndex<TProfile> & string,
    TDestinationKey extends keyof ProfileIndex<TProfile>[TSourceKey] & string
  > (sourceKey: TSourceKey, source: ProfileSource<ProfileIndex<TProfile>[TSourceKey][TDestinationKey]>, destinationKey: TDestinationKey) => ProfileDestination<ProfileIndex<TProfile>[TSourceKey][TDestinationKey]>,
  mapMany: <
    TSourceKey extends keyof ProfileIndex<TProfile> & string,
    TDestinationKey extends keyof ProfileIndex<TProfile>[TSourceKey] & string
  > (sourceKey: TSourceKey, sourceArray: ProfileSource<ProfileIndex<TProfile>[TSourceKey][TDestinationKey]>[], destinationKey: TDestinationKey) => ProfileDestination<ProfileIndex<TProfile>[TSourceKey][TDestinationKey]>[],
}
