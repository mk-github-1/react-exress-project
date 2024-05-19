/*
 * ILoginUserRepository
 *
 */
import { IGenericRepository } from '@/domain/utilities/generic-interface/IGenericRepository'
import { LoginUserEntity } from '@/domain/entities/auth/LoginUserEntity'

export interface ILoginUserRepository extends IGenericRepository<LoginUserEntity> {
  find(keys: Record<string, string>): Promise<LoginUserEntity[]>
  findOne(keys: Record<string, string>): Promise<LoginUserEntity | null>
  create(loginUserDto: LoginUserEntity): Promise<LoginUserEntity>
  update(keys: Record<string, string>, loginUserEntity: LoginUserEntity): Promise<LoginUserEntity>
  delete(keys: Record<string, string>): Promise<Record<string, string>>
  sort<T extends { keys: Record<string, string>; value: number }>(lists: T[]): Promise<number>
}
