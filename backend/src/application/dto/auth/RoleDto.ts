/*
 * RoleDto
 * dtoはinterfaceとして定義
 */
export class RoleDto {
  roleId?: string
  roleName?: string
  sortOrder?: number
  isDeleted?: boolean
  createdAt?: Date
  updatedAt?: Date
  createdById?: string
  updatedById?: string
}
