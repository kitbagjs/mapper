// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MaybeImport = () => Record<PropertyKey, any>

export function loadProfiles<TImported extends MaybeImport, TReturns = ReturnType<TImported> extends Record<string, infer TValue> ? TValue : never>(load: TImported): TReturns[] {
  const value = load()
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