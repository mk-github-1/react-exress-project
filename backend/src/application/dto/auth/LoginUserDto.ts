/*
 * LoginUserDto
 * dtoはinterfaceとして定義
 */
import { LoginUserRoleDto } from '@/application/dto/auth/LoginUserRoleDto'

export class LoginUserDto {
  account?: string
  username?: string
  password?: string
  enabled?: boolean
  accountNonExpired?: boolean
  accountNonLocked?: boolean
  credentialsNonExpired?: boolean
  sortOrder?: number
  isDeleted?: boolean
  createdAt?: Date
  updatedAt?: Date
  createdById?: string
  updatedById?: string
  loginUserRoleDtos?: LoginUserRoleDto[]
}
