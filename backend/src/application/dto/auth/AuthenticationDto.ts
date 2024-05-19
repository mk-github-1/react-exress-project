/*
 * AuthenticationDto
 * dtoはinterfaceとして定義
 */
import { LoginUserRoleDto } from './LoginUserRoleDto'

export class AuthenticationDto {
  constructor(data: {
    account: string
    username: string
    password: string
    rePassword: string
    enabled: boolean
    accountNonExpired: boolean
    accountNonLocked: boolean
    credentialsNonExpired: boolean
    postType: number
    loginUserRoleDtos: LoginUserRoleDto[]
  }) {
    this.account = data ? data.account : ''
    this.username = data ? data.username : ''
    this.password = data ? data.password : ''
    this.rePassword = data ? data.rePassword : ''
    this.postType = data ? data.postType : 0
    this.enabled = data ? data.enabled : false
    this.accountNonExpired = data ? data.accountNonExpired : true
    this.accountNonLocked = data ? data.accountNonLocked : true
    this.credentialsNonExpired = data ? data.credentialsNonExpired : true
    this.loginUserRoleDtos = data ? data.loginUserRoleDtos : []
  }

  account: string
  username?: string
  password?: string
  rePassword?: string
  postType?: number
  enabled?: boolean
  accountNonExpired?: boolean
  accountNonLocked?: boolean
  credentialsNonExpired?: boolean
  loginUserRoleDtos?: LoginUserRoleDto[]
}
