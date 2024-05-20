/*
 * index.ts: Expressアプリケーションのエントリーポイント
 *
 */
// ■ Express.jsをTypeScript化

// ■ フォルダ移動、ファイル変更: backend/app.js -> backend/src/index.ts
// var path = require('path');
import 'reflect-metadata'
import express, { Express, Request, Response, NextFunction } from 'express' // var express = require('express');
// import createError from 'http-errors' // var createError = require('http-errors');
import cookieParser from 'cookie-parser' // var cookieParser = require('cookie-parser');
import cors from 'cors'
import logger from 'morgan' // var logger = require('morgan');
import routes from '@/router'
import { AppDataSource } from '@/data-source'
import { errorMiddleware } from './settings/middleware/errorMiddleware'
import { authenticationMiddleware } from './settings/middleware/authenticationMiddleware'
// import fs from 'fs-extra'

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

// dotenvを追加
dotenv.config()

/**************************************************
 * Middleware
 *
 */
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

// ■ 追加
// CORSミドルウェアの使用 ※localhostでもポート違いにリクエストを送るために必要
app.use(cors())

// 共通の例外時の処理をする自作ミドルウェア
app.use(errorMiddleware)

// ルートに応じた認証処理(JWT検証)をする自作ミドルウェア
app.use(authenticationMiddleware)

/**************************************************
 * Routes
 *
 */
// ■ 追加
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

/**************************************************
 * Listen
 *
 */
// ■ 追加
// ポート設定を追加してアプリを起動
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

// TypeORMでデータベース接続を起動
// mysqlは3306、postresqlは5423、sqliteはダミー番号8000で指定
const dbPort: number = 5000
app.listen(dbPort, () => {
  try {
    AppDataSource.initialize()
    console.log(`Data Source has been initialized on port ${httpPort}`)
  } catch (error: unknown) {
    console.error('Error during Data Source initialization:', error)
    throw error
    // process.exit(1);
  }
})

// ■ 削除
// APIとして利用するため
// var indexRouter = require("./routes/index");
// var usersRouter = require("./routes/users");
// app.use(express.static(path.join(__dirname, "public")));
// app.use("/", indexRouter);
// app.use("/users", usersRouter);

module.exports = app
