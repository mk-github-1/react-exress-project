/*
 * LoginUserRepository
 * Repository interfaceの実装、inversify(DI)経由で利用
 */
import { injectable, inject } from 'inversify'
import { Types } from '@/settings/inversify/Types'
import { DataSource, EntityManager } from 'typeorm'
import { LoginUserEntity } from '@/domain/entities/auth/LoginUserEntity'
import { ILoginUserRepository } from '@/domain/repositories/auth/ILoginUserRepository'

@injectable()
export class LoginUserRepository implements ILoginUserRepository {
  private entityManager: EntityManager

  constructor(@inject(Types.DataSource) dataSource: DataSource) {
    this.entityManager = dataSource.manager

    this.find = this.find.bind(this)
    this.findOne = this.findOne.bind(this)
    this.create = this.create.bind(this)
    this.update = this.update.bind(this)
    this.delete = this.delete.bind(this)
    this.sort = this.sort.bind(this)
  }

  // Read
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async find(keys: Record<string, string>): Promise<LoginUserEntity[]> {
    // entityが持つサブリスト(loginUserRoles)を取得できるか確認
    const loginUserEntities: LoginUserEntity[] = await this.entityManager.findBy(LoginUserEntity, {
      /* FindOptions: where */
    })

    return loginUserEntities
  }

  async findOne(keys: Record<string, string>): Promise<LoginUserEntity | null> {
    const account: string = keys['account']

    const loginUserEntity: LoginUserEntity | null = await this.entityManager.findOneBy(LoginUserEntity, {
      account: account
    })

    return loginUserEntity
  }

  // Create (TypeORM is "insert")
  async create(loginUserEntity: LoginUserEntity): Promise<LoginUserEntity> {
    await this.entityManager.insert(LoginUserEntity, loginUserEntity)

    return loginUserEntity
  }

  // Update
  async update(keys: Record<string, string>, loginUserEntity: LoginUserEntity): Promise<LoginUserEntity> {
    const account: string = keys['account']

    await this.entityManager.update(LoginUserEntity, [account], loginUserEntity)

    return loginUserEntity
  }

  // Delete
  async delete(keys: Record<string, string>): Promise<Record<string, string>> {
    const account: string = keys['account']

    // Logical delete
    const loginUserEntity: LoginUserEntity | null = await this.entityManager.findOneBy(LoginUserEntity, {
      account: account
    })

    if (loginUserEntity) {
      loginUserEntity.isDeleted = true
      await this.entityManager.update(LoginUserEntity, [account], loginUserEntity)
    }

    // Physical delete sample
    // await this.entityManager.delete(LoginUserEntity, [account])

    return keys
  }

  // Sort (sample)
  async sort<T extends { keys: Record<string, string>; value: number }>(lists: T[]): Promise<number> {
    // Note: Sql injection
    // this.entityManager.query(sql, params)経由でパラメータを渡すこと
    const params: { name: string; value: unknown }[] = []

    // 同じ順序がある時、更新日の新しいものを上にする
    // isDeleted == trueは順序を後にする
    let sql: string = `
      DECLARE @temp TABLE (
        account int NOT NULL,
        sortOrder int NOT NULL
      )
    `
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    lists.forEach((element: any, index: number) => {
      sql += `
        INSERT INTO @temp (account, sortOrder) VALUES (@account${index}, @sortOrder${index})
      `
      params.push({ name: `@account${index}`, value: element.keys[0] })
      params.push({ name: `@sortOrder${index}`, value: element.value })
    })

    sql += `
      UPDATE login_user
      SET sortOrder = B.sortOrder
      FROM login_user AS A
      LEFT OUTER JOIN (
        SELECT C.id, ROW_NUMBER() OVER (
          ORDER BY
            C.isDeleted ASC,
            D.sortOrder ASC,
            C.updatedAt DESC
        ) AS 'sortOrder
        FROM login_user AS C
        LEFT OUTER JOIN @temp AS D
        ON C.id = D.id
      ) AS B
      ON A.id = B.id
      WHERE B.id IS NOT NULL
   `
    await this.entityManager.query(sql, params)

    return 0
  }
}
