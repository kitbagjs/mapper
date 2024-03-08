import { ProfileNotFoundError } from '@/profileNotFoundError'
import { GenericMapper, Mapper, Profile, ProfileKey } from '@/types'

export function createMapper<T extends Profile>(profiles: T[]): Mapper<T> {

  const profileMap = buildProfilesMap(profiles)

  function getProfile(sourceKey: T['sourceKey'], destinationKey: T['destinationKey']): Profile {
    const key: ProfileKey<T> = `${sourceKey}-${destinationKey}`
    const profile = profileMap.get(key)

    if (!profile) {
      throw new ProfileNotFoundError(sourceKey, destinationKey)
    }

    return profile
  }

  const mapper: GenericMapper = {
    map: (sourceKey, source, destinationKey) => {
      const { map } = getProfile(sourceKey, destinationKey)
      const profile = { map: map.bind(mapper) }

      return profile.map(source)
    },
    mapMany: (sourceKey, sourceArray, destinationKey) => {
      const { map } = getProfile(sourceKey, destinationKey)
      const profile = { map: map.bind(mapper) }

      return sourceArray.map(source => profile.map(source))
    },
  }

  return mapper
}

function buildProfilesMap<T extends Profile>(profiles: T[]): Map<ProfileKey<T>, Profile> {
  const map: Map<ProfileKey<T>, Profile> = new Map()

  for (const profile of profiles) {
    map.set(`${profile.sourceKey}-${profile.destinationKey}`, profile)
  }

  return map
}
