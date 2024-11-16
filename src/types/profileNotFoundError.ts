export class ProfileNotFoundError extends Error {
  public constructor(sourceKey: string, destinationKey: string) {
    super(`Profile not found for source ${sourceKey} and destination ${destinationKey}`)
  }
}
