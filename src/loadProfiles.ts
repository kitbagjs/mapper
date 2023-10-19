import { MaybePromise } from '@/types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MaybeImport = () => MaybePromise<Record<PropertyKey, any>>

export async function loadProfiles<TImported extends MaybeImport, TReturns = Awaited<ReturnType<TImported>> extends Record<string, infer TValue> ? TValue : never>(load: TImported): Promise<TReturns[]> {
  const value = await load()
  const maybeProfiles = Object.values(value)

  if (!maybeProfiles.every(isValidProfile)) {
    throw 'Every value provided to loadProfiles must implement Profile'
  }

  return maybeProfiles
}

function isValidProfile(value: unknown): boolean {
  return !!value && typeof value === 'object'
   && 'sourceKey' in value && typeof value.sourceKey === 'string'
   && 'destinationKey' in value && typeof value.destinationKey === 'string'
   && 'map' in value && typeof value.map === 'function'
}