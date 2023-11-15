import { ProfileNotFoundError } from '@/profileNotFoundError'
import { Mapper, Profile, ProfileKey } from '@/types'

export function createMapper<T extends Profile>(profiles: T[]): Mapper<T> {

  const mappers = buildProfilesMap(profiles)

  const mapper: Mapper<T> = {
    map: (sourceKey, source, destinationKey) => {
      const key: ProfileKey = `${sourceKey}-${destinationKey}`
      const mapper = mappers.get(key)

      if (!mapper) {
        throw new ProfileNotFoundError(sourceKey, destinationKey)
      }

      return mapper(source)
    },
    mapMany: (sourceKey, sourceArray, destinationKey) => {
      return sourceArray.map(source => mapper.map(sourceKey, source, destinationKey))
    },
  }

  return mapper
}

function buildProfilesMap<T extends Profile>(profiles: T[]): Map<ProfileKey, Profile['map']> {
  const map: Map<ProfileKey, Profile['map']> = new Map()

  for (const profile of profiles) {
    map.set(`${profile.sourceKey}-${profile.destinationKey}`, profile.map)
  }

  return map
}
