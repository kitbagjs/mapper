export class ProfileTypeError extends Error {
  public constructor() {
    super('Every value provided to loadProfiles must implement Profile')
  }
}