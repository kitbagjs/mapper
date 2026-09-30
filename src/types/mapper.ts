import { ExtractSourceKeys, Profile } from '@/types/profile'

/**
 * Type-level index of profiles by source and destination key, reused when checking mapping calls.
 */
type ProfileIndex<TProfile> = {
  [TSourceKey in ExtractSourceKeys<TProfile>]: {
    [TMatch in Extract<TProfile, { sourceKey: TSourceKey }> as TMatch extends Profile ? TMatch['destinationKey'] : never]: TMatch
  }
}

// A broad source key can collapse index entries together. Check the selected source key
// before extracting types so unrelated profiles cannot become valid matches.

/** Extracts the source type from a profile. `unknown` for the destination parameter matches any profile regardless of its destination type. */
type ProfileSource<TProfile, TSourceKey extends string> = TProfile extends Profile<TSourceKey, infer TSource, string, unknown> ? TSource : never

/** Extracts the destination type from a profile. `never` for the source parameter exploits contravariance — any concrete source type satisfies `never extends TSource` in the function position, so the source type does not restrict the match. */
type ProfileDestination<TProfile, TSourceKey extends string> = TProfile extends Profile<TSourceKey, never, string, infer TDestination> ? TDestination : never

export type Mapper<TProfiles extends readonly Profile[], TProfile = TProfiles[number]> = {
  register: (profiles: Profile[] | readonly Profile[] | Profile) => void,
  clear: () => void,
  has: (sourceKey: string, destinationKey: string) => boolean,
  map: <
    TSourceKey extends keyof ProfileIndex<TProfile> & string,
    TDestinationKey extends keyof ProfileIndex<TProfile>[TSourceKey] & string
  > (sourceKey: TSourceKey, source: ProfileSource<ProfileIndex<TProfile>[TSourceKey][TDestinationKey], TSourceKey>, destinationKey: TDestinationKey) => ProfileDestination<ProfileIndex<TProfile>[TSourceKey][TDestinationKey], TSourceKey>,
  mapMany: <
    TSourceKey extends keyof ProfileIndex<TProfile> & string,
    TDestinationKey extends keyof ProfileIndex<TProfile>[TSourceKey] & string
  > (sourceKey: TSourceKey, sourceArray: ProfileSource<ProfileIndex<TProfile>[TSourceKey][TDestinationKey], TSourceKey>[], destinationKey: TDestinationKey) => ProfileDestination<ProfileIndex<TProfile>[TSourceKey][TDestinationKey], TSourceKey>[],
}
