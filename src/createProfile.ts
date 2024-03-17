import { Profile } from '@/types'
import { AnyFunction } from '@/utilities'

export function createProfile<
  TSourceKey extends string,
  TDestinationKey extends string,
  TMap extends AnyFunction>(
  sourceKey: TSourceKey,
  destinationKey: TDestinationKey,
  map: TMap,
): Profile<TSourceKey, Parameters<TMap>[0], TDestinationKey, ReturnType<TMap>> {
  return {
    sourceKey,
    destinationKey,
    map,
  }
}