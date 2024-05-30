/*
 * LoginUser
 *
 */
export type LoginUser = {
  account: string
  username: string

  // passwordは返却せず、jsonWebTokenを返却する
  jsonWebToken?: string

  enabled: boolean
  accountNonExpired: boolean
  accountNonLocked: boolean
  credentialsNonExpired: boolean
  sortOrder: number
  isDeleted: boolean
  createdAt?: Date
  updatedAt?: Date
  createdById?: string
  updatedById?: string
  // loginUserRoleDtos: LoginUserRoleDto[]
}
