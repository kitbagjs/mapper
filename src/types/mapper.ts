import { Profile, ProfileDestination, ProfileSource } from '@/types/profile'

export type Mapper<T extends Profile> = {
  map: (sourceKey: T['sourceKey'], source: ProfileSource<T>, destinationKey: T['destinationKey']) => ProfileDestination<T>,
  mapMany: (sourceKey: T['sourceKey'], sourceArray: ProfileSource<T>[], destinationKey: T['destinationKey']) => ProfileDestination<T>[],
}