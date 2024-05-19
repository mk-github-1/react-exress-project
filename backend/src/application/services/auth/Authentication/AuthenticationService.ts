/*
 * AuthenticationService
 * Service interfaceの実装、inversify(DI)経由で利用
 */
import bcrypt from 'bcrypt'
import { injectable, inject } from 'inversify'
import { DataSource, EntityManager } from 'typeorm'
import { plainToClass } from 'class-transformer'
import { CustomException } from '@/settings/CustomException'
import { Types } from '@/settings/inversify/Types'
import { LoginUserEntity } from '@/domain/entities/auth/LoginUserEntity'
import { LoginUserRoleEntity } from '@/domain/entities/auth/LoginUserRoleEntity'
import { ILoginUserRepository } from '@/domain/repositories/auth/ILoginUserRepository'
import { IAuthenticationService } from '@/application/services/auth/Authentication/IAuthenticationService'
import { AuthenticationDto } from '@/application/dto/auth/AuthenticationDto'
import { LoginUserRoleDto } from '@/application/dto/auth/LoginUserRoleDto'

@injectable()
export class AuthenticationService implements IAuthenticationService {
  private entityManager: EntityManager
  private loginUserRepository: ILoginUserRepository

  constructor(
    @inject(Types.DataSource) dataSource: DataSource,
    @inject(Types.LoginUserRepository) loginUserRepository: ILoginUserRepository
  ) {
    this.entityManager = dataSource.manager
    this.loginUserRepository = loginUserRepository

    this.authentication = this.authentication.bind(this)
    this.create = this.create.bind(this)
    this.update = this.update.bind(this)
  }

  // 認証処理
  async authentication(keys: Record<string, string>): Promise<AuthenticationDto> {
    // Repository operation
    const loginUserEntity: LoginUserEntity | null = await this.loginUserRepository.findOne(keys)

    if (!loginUserEntity) {
      throw new CustomException(404, 'warning', '')
    }

    // rePassword: '',
    // postType: 0,

    // Entity -> dto mapping
    const authenticationDto: AuthenticationDto = {
      account: loginUserEntity['account'],
      username: '',
      password: '',
      rePassword: '',
      postType: 0,
      enabled: loginUserEntity['enabled'],
      accountNonExpired: loginUserEntity['accountNonExpired'],
      accountNonLocked: loginUserEntity['accountNonLocked'],
      credentialsNonExpired: loginUserEntity['credentialsNonExpired'],
      loginUserRoleDtos: []
    }

    authenticationDto.loginUserRoleDtos = loginUserEntity['loginUserRoleEntities'].map(
      (element: LoginUserRoleEntity) => {
        const loginUserRoleDto: LoginUserRoleDto = plainToClass(LoginUserRoleDto, element, {
          excludeExtraneousValues: true
        })

        return loginUserRoleDto
      },
      []
    )

    /*
    ★失敗回数の制限とロック: 一定回数の連続したログイン失敗後にアカウントをロックします
    ★ロック解除の機能: 一定の期間が経過するとアカウントを自動的にロック解除する機能を実装
    ★通知機能: ユーザーに通知する機能
    ★セキュリティ対策: セキュリティを考慮。例えば、ログインの試行回数がロック解除の期間内でもリセットされないようにする
     */
    // Account check
    if (
      authenticationDto['enabled'] && // アカウントが有効かどうか true
      !authenticationDto['accountNonExpired'] && // アカウントの有効期限が切れているかどうか false
      !authenticationDto['accountNonLocked'] && // アカウントがロックされているかどうか false カウントが崛起なのでDBと相性が悪い
      !authenticationDto['credentialsNonExpired'] // 資格情報の有効期限が切れているかどうか false
    ) {
      // 認証エラーは401
      throw new CustomException(401, 'warning', '')
    }

    return authenticationDto
  }

  // Create
  async create(authenticationDto: AuthenticationDto): Promise<AuthenticationDto> {
    // Dto -> entity mapping
    // メールで認証するまで有効にしないなども考えられる
    let loginUserEntity: LoginUserEntity = {
      account: authenticationDto['account'],
      username: authenticationDto['username'] ? authenticationDto['username'] : '',
      password: authenticationDto['password'] ? authenticationDto['password'] : '',
      enabled: false,
      accountNonExpired: true,
      accountNonLocked: true,
      credentialsNonExpired: true,
      sortOrder: 0,
      isDeleted: false,

      loginUserRoleEntities: []
    }

    // passwordはbcriptで暗号化
    const saltRounds: number = 10
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const hashedPassword: string = await new Promise(
      (resolve: (value: string | PromiseLike<string>) => void /*, reject: (reason?: unknown) => void*/) => {
        bcrypt.hash(loginUserEntity['password'], saltRounds, (error: unknown, encrypted: string) => {
          resolve(encrypted)
        })
      }
    )
    loginUserEntity['password'] = hashedPassword

    // Transaction & repository operation (commit or rollback)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return await this.entityManager.transaction(async (transactionalEntityManager: EntityManager) => {
      loginUserEntity = await this.loginUserRepository.create(loginUserEntity)
      return authenticationDto
    })
  }

  // Update (rePassword)
  async update(authenticationDto: AuthenticationDto): Promise<AuthenticationDto> {
    // Get keys & Dto -> entity mapping
    const keys: Record<string, string> = { account: authenticationDto['account'] }

    // Dto -> entity mapping
    let loginUserEntity: LoginUserEntity = {
      account: authenticationDto['account'],
      username: authenticationDto['username'] ? authenticationDto['username'] : '',
      password: authenticationDto['password'] ? authenticationDto['password'] : '',
      enabled: true,
      accountNonExpired: true,
      accountNonLocked: true,
      credentialsNonExpired: true,
      sortOrder: 0,
      isDeleted: false,

      loginUserRoleEntities: []
    }

    // rePasswordをbcriptで暗号化
    const saltRounds: number = 10
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const hashedPassword: string = await new Promise((resolve: any): void => {
      const rePassword: string = authenticationDto['rePassword'] ? authenticationDto['rePassword'] : ''

      bcrypt.hash(rePassword, saltRounds, (error: unknown, encrypted: string) => {
        resolve(encrypted)
      })
    })
    loginUserEntity['password'] = hashedPassword

    // パスワードを変更したら、確認メールを送ってから更新する？
    // Transaction & repository operation (commit or rollback)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return await this.entityManager.transaction(async (transactionalEntityManager: EntityManager) => {
      loginUserEntity = await this.loginUserRepository.update(keys, loginUserEntity)

      // Entity -> dto mapping
      const authenticationDto: AuthenticationDto = plainToClass(AuthenticationDto, loginUserEntity, {
        excludeExtraneousValues: true
      })

      return authenticationDto
    })
  }
}
