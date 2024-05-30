/**************************************************
 * index.ts: Expressアプリケーションのエントリーポイント
 *
 */

/**************************************************
 * 1. Imports
 *
 */
// 【変更】Express.jsをTypeScript化

// 1. NPM packages
import 'reflect-metadata'
import express, { Express, Request, Response } from 'express' // 【元コード】var express = require('express');
import cookieParser from 'cookie-parser' // 【元コード】var cookieParser = require('cookie-parser');
import cors from 'cors'
import dotenv from 'dotenv'
// import fs from 'fs-extra' //【元コード】var path = require('path');
import logger from 'morgan' //【元コード】var logger = require('morgan');

// 自作のerrorMiddlewareを使用しているので未使用とした
// import createError from 'http-errors' // 【元コード】var createError = require('http-errors');

// https対応用
// import { IncomingMessage, ServerResponse } from 'http'
// import https from 'https'

// 2. Self const or functions
import { AppDataSource } from '@/data-source'
import { routes } from '@/router'
import { errorMiddleware } from '@/settings/middleware/errorMiddleware'

// テスト中のため使用していない
// import { authenticationMiddleware } from './settings/middleware/authenticationMiddleware'

/**************************************************
 * 2. Express & dotenv initialize
 *
 */
const app: Express = express() // 【元コード】 var app = express();
dotenv.config()

/**************************************************
 * 3, Middleware settings
 *
 */
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

// 【追加】以下のミドルウェアを追加

// CORSミドルウェアの使用 ※localhostでもポート違いにリクエストを送るために必要
app.use(cors())

// 自作ミドルウェア: 共通の例外時の処理をする
app.use(errorMiddleware)

// 自作ミドルウェア: ルートに応じた認証処理(JWT検証)をする
// テスト中のためOFF
// app.use(authenticationMiddleware)

// 【削除】
// APIとして利用するため
// app.use(express.static(path.join(__dirname, "public")));

/**************************************************
 * 4. Router settings
 *
 */
// 【変更】以下、APIとして利用する設定、routerの別ファイル化

// API用ルーターをマウント
app.use('/api', routes())

/**********/
// ダミーデータ返却用ルート
app.get('/api', (request: Request, response: Response) => {
  // ここにfrontendに返すJSON形式のダミーデータを設定する
  // frontendではJSON.parse(responseText)のようにするとJSONデータをオブジェクト、または配列オブジェクトに変換できる

  // テストのためRecord型で定義しています。
  // const text: Record<string, string>[] = { message: '200 OK' }
  const text: Record<string, string>[] = [{ message: '200 OK' }]

  response.json(text)
})
/**********/

// backendでの例外発生時はerrorMiddlewareで処理(動作再確認する)

// 存在しないルートを指定した時、404 Not Foundとする
app.use('*', (request: Request, response: Response) => {
  response.status(404).json({ message: '404 Not Found' })
})

// 共通の成功時の処理 ※不要？
/*
app.use((request: Request, response: Response) => {
  response.status(200).json({ message: '200 OK' })
})
 */

// 【削除】APIとして利用するため、元コードは削除
// var indexRouter = require("./routes/index");
// var usersRouter = require("./routes/users");
// app.use("/", indexRouter);
// app.use("/users", usersRouter);

/**************************************************
 * 5. Server listen
 *
 */
// 【追加】ポート設定を指定してアプリを起動
const httpPort: number = 3000 // process.env.PORT ||
app.listen(httpPort, () => {
  console.log(`Server is running on port ${httpPort}`)
})

// httpsを利用する場合
// ローカル用の証明書を使えるか調査が必要
/*
const server: https.Server<typeof IncomingMessage, typeof ServerResponse> = https.createServer(
  {
    key: fs.readFileSync('../lets_encript.key'),
    cert: fs.readFileSync('../lets_encript_fullchain.crt')
  },
  app
)

server.listen(httpPort, () => {
  console.log(`Server is running on port ${httpPort}`)
})
 */

// 【追加】TypeORMでデータベース接続を起動
// sqlite    : 5000(ダミー番号)
// mysql     : 3306
// postresql : 5423
const databasePort: number = 5000
app.listen(databasePort, () => {
  try {
    AppDataSource.initialize()
    console.log(`Data Source has been initialized on port ${databasePort}`)
  } catch (error: unknown) {
    console.error('Error during Data Source initialization:', error)
    throw error
    // process.exit(1);
  }
})

module.exports = app
