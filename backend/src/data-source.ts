/*
 * AppDateSource: TypeORM設定
 *
 */
import path from 'path'
import { DataSource } from 'typeorm'
import { LoginUserEntity } from '@/domain/entities/auth/LoginUserEntity'
import { LoginUserRoleEntity } from '@/domain/entities/auth/LoginUserRoleEntity'
import { RoleEntity } from '@/domain/entities/auth/RoleEntity'
import { CustomNamingStrategy } from '@/settings/typeorm/CustomNamingStrategy'
import { ConcurrencySubscriber } from '@/settings/typeorm/ConcurrencySubscriber'

// dotenvを追加
import dotenv from 'dotenv'
dotenv.config()

const database: string = '../data/data.db' // envの使用方法は検証中、path.resolve(__dirname, process.env['database'] as string)

export const AppDataSource: DataSource = new DataSource({
  // 1.利用するデータベース
  type: 'sqlite', // or mysql, mariadb, postgresql, etc
  // host: process.env['host'] as string, // sqliteは不要
  // port: Number(process.env['port']), // mysqlは3306、postresqlは5423、sqliteは不要
  // username: process.env['username'] as string, // 任意、sqliteは不要
  // password: process.env['password'] as string, // 任意、sqliteは不要

  // mysql, postgresqlはデータベース名
  database: database,

  // 2.Entityクラス
  entities: [
    // auth
    LoginUserEntity,
    LoginUserRoleEntity,
    RoleEntity

    // master

    // transaction
  ],

  // 3.マイグレーションファイルの格納場所
  migrations: ['./migrations/*.ts'],

  // 4.customNamingStrategyでプロパティ名をスネークケースに変換
  namingStrategy: new CustomNamingStrategy(),

  // 5.EntityのイベントをListenする、データの競合チェックで利用
  subscribers: [ConcurrencySubscriber],

  // 6.ログを出力するか
  logging: true,

  // 7.trueにするとテーブルが自動生成される、本番環境では使用禁止
  synchronize: false
})
