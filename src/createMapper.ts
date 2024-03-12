import { Mapper, Profile, ProfileKey, RegisteredProfile, RegisteredProfiles, ProfileNotFoundError } from '@/types'
import { asArray } from '@/utilities'

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

  const register: Mapper<RegisteredProfiles>['register'] = (maybeProfiles) => {
    const profiles = asArray(maybeProfiles)

    for (const profile of profiles) {
      profileMap.set(`${profile.sourceKey}-${profile.destinationKey}`, profile)
    }
  }

  const has: Mapper<RegisteredProfiles>['has'] = (sourceKey: string, destinationKey: string) => {
    try {
      getProfile(sourceKey, destinationKey)

      return true
    } catch {
      return false
    }
  }

  const clear: Mapper<RegisteredProfiles>['clear'] = () => {
    profileMap.clear()
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
    has,
    clear,
    map,
    mapMany,
  }

  return mapper
}
