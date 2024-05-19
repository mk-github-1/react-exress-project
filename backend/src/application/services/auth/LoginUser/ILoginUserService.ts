/*
 * ILoginUserService
 *
 */
import { IGenericService } from '@/domain/utilities/generic-interface/IGenericService'
import { LoginUserDto } from '@/application/dto/auth/LoginUserDto'

export interface ILoginUserService extends IGenericService<LoginUserDto> {
  find(keys: Record<string, string>): Promise<LoginUserDto[]>
  findOne(keys: Record<string, string>): Promise<LoginUserDto | null>
  create(loginUserDto: LoginUserDto): Promise<LoginUserDto>
  update(loginUserDto: LoginUserDto): Promise<LoginUserDto>
  delete(keys: Record<string, string>): Promise<Record<string, string>>
  sort(loginUserDtos: LoginUserDto[]): Promise<number>
}
