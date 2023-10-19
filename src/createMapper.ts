import { Profile, Mapper } from '@/types'

export function createMapper<T extends Profile>(profiles: T[]): Mapper<T> {

  const mapper: Mapper<T> = {
    map: (sourceKey, source, destinationKey) => {
      const profile = profiles.find(profile => profile.sourceKey === sourceKey && profile.destinationKey === destinationKey)

      if (!profile) {
        throw 'Mapping profile not found'
      }

      return profile.map(source, mapper)
    },
    mapMany: (sourceKey, sourceArray, destinationKey) => {
      return sourceArray.map(source => mapper.map(sourceKey, source, destinationKey))
    },
  }

  return mapper
}