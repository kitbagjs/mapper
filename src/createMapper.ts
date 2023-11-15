import { ProfileNotFoundError } from '@/profileNotFoundError'
import { Mapper, Profile, ProfileKey } from '@/types'

export function createMapper<T extends Profile>(profiles: T[]): Mapper<T> {

  const profileMap = buildProfilesMap(profiles)

  function findProfile(sourceKey: T['sourceKey'], destinationKey: T['destinationKey']): Profile['map'] {
    const key: ProfileKey<T> = `${sourceKey}-${destinationKey}`
    const profile = profileMap.get(key)

    if (!profile) {
      throw new ProfileNotFoundError(sourceKey, destinationKey)
    }

    return profile
  }

  const mapper: Mapper<T> = {
    map: (sourceKey, source, destinationKey) => {
      const profile = findProfile(sourceKey, destinationKey)

      return profile(source)
    },
    mapMany: (sourceKey, sourceArray, destinationKey) => {
      const profile = findProfile(sourceKey, destinationKey)

      return sourceArray.map(source => profile(source))
    },
  }

  return mapper
}

function buildProfilesMap<T extends Profile>(profiles: T[]): Map<ProfileKey<T>, Profile['map']> {
  const map: Map<ProfileKey<T>, Profile['map']> = new Map()

  for (const profile of profiles) {
    map.set(`${profile.sourceKey}-${profile.destinationKey}`, profile.map)
  }

  return map
}
