import { ProfileTypeError } from '@/types/profileTypeError'
import { AnyFunction, flatten } from '@/utilities'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Imported = Record<PropertyKey, any>
type MaybeImport = Imported | (() => Imported)
type RecordValue<T> = T extends Record<PropertyKey, infer TValue> ? TValue : T
type UnArray<T> = T extends readonly (infer TValue)[] ? UnArray<TValue> : T
type ImportValue<T> = UnArray<RecordValue<T>>

function toValue(maybeImport: MaybeImport): Imported {
  if (typeof maybeImport === 'function') {
    return maybeImport()
  }

  return maybeImport
}

export function loadProfiles<
  TImported extends MaybeImport,
  TReturns = TImported extends AnyFunction ? ImportValue<ReturnType<TImported>> : ImportValue<TImported>
>(load: TImported): TReturns[] {
  const value = toValue(load)
  const profilesToLoad = flatten(Object.values(value))

  if (!profilesToLoad.every(isValidProfile)) {
    throw new ProfileTypeError()
  }

  return profilesToLoad
}

function isValidProfile(value: unknown): boolean {
  return !!value && typeof value === 'object'
   && 'sourceKey' in value && typeof value.sourceKey === 'string'
   && 'destinationKey' in value && typeof value.destinationKey === 'string'
   && 'map' in value && typeof value.map === 'function'
}