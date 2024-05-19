/*
 * LoginUserService
 * Service interfaceの実装、inversify(DI)経由で利用
 */
import { injectable, inject } from 'inversify'
import { Types } from '@/settings/inversify/Types'
import { DataSource, EntityManager } from 'typeorm'
import { plainToClass } from 'class-transformer'
import { CustomException } from '@/settings/CustomException'
import { LoginUserEntity } from '@/domain/entities/auth/LoginUserEntity'
import { LoginUserRoleEntity } from '@/domain/entities/auth/LoginUserRoleEntity'
import { ILoginUserRepository } from '@/domain/repositories/auth/ILoginUserRepository'
import { ILoginUserService } from '@/application/services/auth/LoginUser/ILoginUserService'
import { LoginUserDto } from '@/application/dto/auth/LoginUserDto'
import { LoginUserRoleDto } from '@/application/dto/auth/LoginUserRoleDto'

@injectable()
export class LoginUserService implements ILoginUserService {
  private entityManager: EntityManager
  private loginUserRepository: ILoginUserRepository

  constructor(
    @inject(Types.DataSource) dataSource: DataSource,
    @inject(Types.LoginUserRepository) loginUserRepository: ILoginUserRepository
  ) {
    this.entityManager = dataSource.manager
    this.loginUserRepository = loginUserRepository

    this.find = this.find.bind(this)
    this.findOne = this.findOne.bind(this)
    this.create = this.create.bind(this)
    this.update = this.update.bind(this)
    this.delete = this.delete.bind(this)
    this.sort = this.sort.bind(this)
  }

  // Read
  async find(keys: Record<string, string>): Promise<LoginUserDto[]> {
    // Repository operation
    const loginUserEntities: LoginUserEntity[] = await this.loginUserRepository.find(keys)

    if (!loginUserEntities.length) {
      throw new CustomException(404, 'warning', '')
    }

    // Entity -> dto mapping
    const loginUserDtos: LoginUserDto[] = loginUserEntities.map((element: LoginUserEntity) => {
      const loginUserDto: LoginUserDto = plainToClass(LoginUserDto, element, { excludeExtraneousValues: true })

      loginUserDto.loginUserRoleDtos = element.loginUserRoleEntities.map((element2: LoginUserRoleEntity) => {
        return plainToClass(LoginUserRoleDto, element2, { excludeExtraneousValues: true })
      }, [])

      return loginUserDto
    }, [])

    return loginUserDtos
  }

  // Read (one)
  async findOne(keys: Record<string, string>): Promise<LoginUserDto | null> {
    // Repository operation
    const loginUserEntity: LoginUserEntity | null = await this.loginUserRepository.findOne(keys)

    if (!loginUserEntity) {
      throw new CustomException(404, 'warning', '')
    }

    // Entity -> dto mapping
    const loginUserDto: LoginUserDto = plainToClass(LoginUserDto, loginUserEntity, {
      excludeExtraneousValues: true
    })

    loginUserDto.loginUserRoleDtos = loginUserEntity.loginUserRoleEntities.map((element: LoginUserRoleEntity) => {
      return plainToClass(LoginUserRoleDto, element, { excludeExtraneousValues: true })
    }, [])

    return loginUserDto
  }

  // Create
  async create(loginUserDto: LoginUserDto): Promise<LoginUserDto> {
    // Dto -> entity mapping
    let loginUserEntity: LoginUserEntity = plainToClass(LoginUserEntity, loginUserDto, {
      excludeExtraneousValues: true
    })

    // Transaction & repository operation (commit or rollback)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return await this.entityManager.transaction(async (transactionalEntityManager: EntityManager) => {
      loginUserEntity = await this.loginUserRepository.create(loginUserEntity)

      // Entity -> dto mapping
      const loginUserDto: LoginUserDto = plainToClass(LoginUserDto, loginUserEntity, {
        excludeExtraneousValues: true
      })

      loginUserDto.loginUserRoleDtos = loginUserEntity.loginUserRoleEntities.map((element: LoginUserRoleEntity) => {
        return plainToClass(LoginUserRoleDto, element, { excludeExtraneousValues: true })
      }, [])

      return loginUserDto
    })
  }

  // Update
  async update(loginUserDto: LoginUserDto): Promise<LoginUserDto> {
    const account: string = loginUserDto['account'] ? loginUserDto['account'] : ''
    const keys: Record<string, string> = { account: account }

    // Dto -> entity mapping
    let loginUserEntity: LoginUserEntity = plainToClass(LoginUserEntity, loginUserDto, {
      excludeExtraneousValues: true
    })

    // Transaction & repository operation (commit or rollback)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return await this.entityManager.transaction(async (transactionalEntityManager: EntityManager) => {
      loginUserEntity = await this.loginUserRepository.update(keys, loginUserEntity)

      // Entity -> dto mapping
      // let？
      const loginUserDto: LoginUserDto = plainToClass(LoginUserDto, loginUserEntity, {
        excludeExtraneousValues: true
      })

      loginUserDto.loginUserRoleDtos = loginUserEntity.loginUserRoleEntities.map((element: LoginUserRoleEntity) => {
        return plainToClass(LoginUserRoleDto, element, { excludeExtraneousValues: true })
      }, [])

      return loginUserDto
    })
  }

  // Delete
  async delete(keys: Record<string, string>): Promise<Record<string, string>> {
    // Transaction & repository operation (commit or rollback)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return await this.entityManager.transaction(async (transactionalEntityManager: EntityManager) => {
      keys = await this.loginUserRepository.delete(keys)

      return keys
    })
  }

  // Sort
  async sort(loginUserDtos: LoginUserDto[]): Promise<number> {
    // Create sortLists
    const lists: { keys: Record<string, string>; value: number }[] = loginUserDtos.map((element: LoginUserDto) => {
      const account: string = element['account'] ? element['account'] : ''
      const value: number = element['sortOrder'] ? element['sortOrder'] : 0

      const item: { keys: Record<string, string>; value: number } = {
        keys: { account: account },
        value: value
      }

      return item
    }, [])

    // transaction & repository operation (commit or rollback)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return await this.entityManager.transaction(async (transactionalEntityManager: EntityManager) => {
      const result: number = await this.loginUserRepository.sort(lists)

      return result
    })
  }
}
