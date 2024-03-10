import { createMapper } from '@/createMapper'
import { Mapper, RegisteredProfiles } from '@/types'

export * from './createMapper'
export * from './loadProfiles'
export * from './types'

const mapper: Mapper<RegisteredProfiles> = createMapper()

export default mapper