import { ProfileTypeError } from '@/types/profileTypeError'
import { AnyFunction } from '@/utilities'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Imported = Record<PropertyKey, any>
type MaybeImport = Imported | (() => Imported)
type RecordValue<T> = T extends Record<string, infer TValue> ? TValue : never

function toValue(maybeImport: MaybeImport): Imported {
  if (typeof maybeImport === 'function') {
    return maybeImport()
  }

  return maybeImport
}

export function loadProfiles<
  TImported extends MaybeImport,
  TReturns = TImported extends AnyFunction ? RecordValue<ReturnType<TImported>> : RecordValue<TImported>
>(load: TImported): TReturns[] {
  const value = toValue(load)
  const maybeProfiles = Object.values(value)

  if (!maybeProfiles.every(isValidProfile)) {
    throw new ProfileTypeError()
  }

  return maybeProfiles
}

function isValidProfile(value: unknown): boolean {
  return !!value && typeof value === 'object'
   && 'sourceKey' in value && typeof value.sourceKey === 'string'
   && 'destinationKey' in value && typeof value.destinationKey === 'string'
   && 'map' in value && typeof value.map === 'function'
}