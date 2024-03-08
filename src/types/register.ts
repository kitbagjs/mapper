import { Profile } from '@/types/profile'

export interface Register {
  // profiles: Profile[]
}

export type RegisteredProfiles = Register extends { profiles: infer TProfiles extends Readonly<Profile[]> }
  ? TProfiles
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  : any

export type RegisteredProfile = RegisteredProfiles[number]