import { createMapper } from '@/createMapper'
import { Mapper, RegisteredProfiles } from '@/types'

export * from './createMapper'
export * from './loadProfiles'
export * from './types'
export * from './profileNotFoundError'

export const mapper: Mapper<RegisteredProfiles> = createMapper()