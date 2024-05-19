/*
 * inversify.config.ts: InversifyのDI登録
 *
 */
import { Container } from 'inversify'
import { Types } from '@/settings/inversify/Types'
import { DataSource } from 'typeorm'
import { AppDataSource } from '@/data-source'

import { ILoginUserRepository } from '@/domain/repositories/auth/ILoginUserRepository'

import { LoginUserRepository } from '@/infrastructure/repository-implements/auth/LoginUserRepository'

import { IAuthenticationService } from '@/application/services/auth/Authentication/IAuthenticationService'
import { AuthenticationService } from '@/application/services/auth/Authentication/AuthenticationService'

import { ILoginUserService } from '@/application/services/auth/LoginUser/ILoginUserService'
import { LoginUserService } from '@/application/services/auth/LoginUser/LoginUserService'

import { AuthenticationController } from '@/interface/controllers/auth/Authentication/AuthenticationController'
import { LoginUserController } from '@/interface/controllers/auth/LoginUser/LoginUserController'
import Ajv from 'ajv'

// 実際の依存関係を追加する ※基本的にシングルトンスコープにする、他の設定にする場合は構築しながら調査
const container: Container = new Container()

// container.bind<"取得する時の型(インタフェース or クラス)">("識別子").to("対象クラス")

/* AppDataSourceをDIコンテナに登録 **************************************************/
// AppDataSource.manager = EntityManagerインタフェース
// container.bind<EntityManager>('EntityManager').toConstantValue(AppDataSource)
container.bind<DataSource>(Types.DataSource).toConstantValue(AppDataSource)

// 本番環境と開発環境の切り替えサンプル
/*
  container.bind<DatabaseInterface>(Types.DataSource).toConstantValue(
    process.env.NODE_ENV === 'production' ? AppDataSource.manager : AppDataSource.manager
  );
 */

/* AjvをDIコンテナに登録 **************************************************/
container.bind<Ajv>(Types.Ajv).toConstantValue(new Ajv())

/* auth **************************************************/

// Authenticate
container.bind<IAuthenticationService>(Types.AuthenticationService).to(AuthenticationService).inSingletonScope()
container.bind<AuthenticationController>(Types.AuthenticationController).to(AuthenticationController).inSingletonScope()

// LoginUser
container.bind<ILoginUserRepository>(Types.LoginUserRepository).to(LoginUserRepository).inSingletonScope()
container.bind<ILoginUserService>(Types.LoginUserService).to(LoginUserService).inSingletonScope()
container.bind<LoginUserController>(Types.LoginUserController).to(LoginUserController).inSingletonScope()

/* master **************************************************/

/* transaction **************************************************/

/* transaction(etc) **************************************************/

export { container } // .createChild()
