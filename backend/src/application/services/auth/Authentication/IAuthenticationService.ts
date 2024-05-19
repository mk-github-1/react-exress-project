/*
 * IAuthenticationService
 *
 */
// import { IGenericService } from '@/domain/utilities/generic-interface/IGenericService'
import { AuthenticationDto } from '@/application/dto/auth/AuthenticationDto'

export interface IAuthenticationService /* extends IGenericService<AuthenticationDto> */ {
  authentication(keys: Record<string, string>): Promise<AuthenticationDto>
  create(authenticationDto: AuthenticationDto): Promise<AuthenticationDto>
  update(authenticationDto: AuthenticationDto): Promise<AuthenticationDto>
}
