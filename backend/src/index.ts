/**************************************************
 * index.ts: Expressアプリケーションのエントリーポイント
 *
 */
// 【変更】Express.jsをTypeScript化

// import fs from 'fs-extra' // var path = require('path');
import 'reflect-metadata'
import express, { Express, Request, Response, NextFunction } from 'express' // var express = require('express');
// import createError from 'http-errors' // var createError = require('http-errors');
import cookieParser from 'cookie-parser' // var cookieParser = require('cookie-parser');
import cors from 'cors'
import logger from 'morgan' // var logger = require('morgan');
import routes from '@/router'
import { AppDataSource } from '@/data-source'
import { errorMiddleware } from './settings/middleware/errorMiddleware'

// テスト中のため使用していない
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { authenticationMiddleware } from './settings/middleware/authenticationMiddleware'

// https対応用
// import { IncomingMessage, ServerResponse } from 'http'
// import https from 'https'
// import fs from 'fs-extra'

import dotenv from 'dotenv'

/**************************************************
 * Express.js準備
 *
 */
const app: Express = express() // var app = express();
dotenv.config()

/**************************************************
 * Middleware
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
 * Routes
 *
 */
// 【変更】以下、APIとして利用する設定、routerの別ファイル化 ※APIの例外はミドルウェアで処理

// API用ルーターをマウント
app.use('/api', routes())

// APIアクセス用のルートハンドラ
app.get('/api', (request: Request, response: Response, nextFunction: NextFunction) => {
  response.json({ message: '200 OK' })
  return nextFunction()
})

// 共通の成功時の処理
app.use((request: Request, response: Response, nextFunction: NextFunction) => {
  response.status(200).json({ message: '200 OK' })
  return nextFunction()
})

// 【削除】
// APIとして利用するため
// var indexRouter = require("./routes/index");
// var usersRouter = require("./routes/users");
// app.use("/", indexRouter);
// app.use("/users", usersRouter);

/**************************************************
 * Listen
 *
 */
// 【追加】ポート設定を指定してアプリを起動
const httpPort: number = 3000 // process.env.PORT ||
app.listen(httpPort, () => {
  console.log(`Server is running on port ${httpPort}`)
})

// httpsを利用する場合
// ローカル用の証明書を使えるか調査
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
