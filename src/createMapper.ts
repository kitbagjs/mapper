import { Mapper, Profile, ProfileKey, RegisteredProfile, RegisteredProfiles, ProfileNotFoundError } from '@/types'

export function createMapper(): Mapper<RegisteredProfiles> {

  const profileMap = new Map<ProfileKey<RegisteredProfile>, Profile>()

  function getProfile(sourceKey: RegisteredProfile['sourceKey'], destinationKey: RegisteredProfile['destinationKey']): Profile {
    const key: ProfileKey<RegisteredProfile> = `${sourceKey}-${destinationKey}`
    const profile = profileMap.get(key)

    if (!profile) {
      throw new ProfileNotFoundError(sourceKey, destinationKey)
    }

    return profile
  }

  const register: Mapper<RegisteredProfiles>['register'] = (profiles) => {
    for (const profile of profiles) {
      profileMap.set(`${profile.sourceKey}-${profile.destinationKey}`, profile)
    }
  }

  const map: Mapper<RegisteredProfiles>['map'] = (sourceKey, source, destinationKey) => {
    const profile = getProfile(sourceKey, destinationKey)

    return profile.map(source)
  }

  const mapMany: Mapper<RegisteredProfiles>['mapMany'] = (sourceKey, sourceArray, destinationKey) => {
    const profile = getProfile(sourceKey, destinationKey)

    return sourceArray.map(source => profile.map(source))
  }

  const mapper: Mapper<RegisteredProfiles> = {
    register,
    map,
    mapMany,
  }

  return mapper
}
