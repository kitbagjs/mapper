import { Profile } from '@/types/profile'

export class ProfileMappingError extends Error {
  public constructor(profile: Profile, options?: ErrorOptions) {
    super(`Failed to Execute map for source "${profile.sourceKey}" and destination "${profile.destinationKey}"`, options)
  }
}
