/*
 * LoginUserRoleDto
 * dtoはinterfaceとして定義
 */
import { LoginUserDto } from '@/application/dto/auth/LoginUserDto'

export class LoginUserRoleDto {
  account?: string
  roleId?: string
  sortOrder?: number
  isDeleted?: boolean
  createdAt?: Date
  updatedAt?: Date
  createdById?: string
  updatedById?: string
  loginUserDto?: LoginUserDto
}
