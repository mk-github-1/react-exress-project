/*
 * errorMiddleware: Middleware that handles common exceptions.
 *
 */
import { Request, Response, NextFunction } from 'express'
import { CustomException } from '@/settings/CustomException'

// error: any?,
export const errorMiddleware = (
  error: CustomException,
  request: Request,
  response: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  nextFunction: NextFunction
): void => {
  const httpStatusCode: number = error.httpStatusCode || 500
  let message: string = ''

  // HTTPステータスコードに対応したメッセージを取得
  switch (httpStatusCode) {
    case 400:
      message = '400 Bad Request'
      break
    case 401:
      message = '401 Unauthorized'
      break
    case 403:
      message = '403 Forbidden'
      break
    case 404:
      message = '404 Not Found'
      break
    case 409:
      message = '409 Conflict'
      break
    default:
      message = '500 Internal Server Error'
  }

  // ログ出力（任意）
  console.error(error.stack)

  // エラーレスポンスをjsonデータで返す
  response.status(httpStatusCode).json({ message: message })
}
