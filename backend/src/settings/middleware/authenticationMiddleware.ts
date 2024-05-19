/*
 * authenticationMiddleware: Middleware that perform authentication processing (JWT verification) according to routes.
 *
 */
import { Request, Response, NextFunction } from 'express'
import { CustomException } from '@/settings/CustomException'
import jsonWebToken, { VerifyErrors } from 'jsonwebtoken'

export const authenticationMiddleware = (request: Request, response: Response, nextFunction: NextFunction): void => {
  // リクエストのパスが/api/authenticationsでない場合にのみJWTの検証を行う
  if (request.path !== '/api/authentications') {
    const token: string = request.headers.authorization ? request.headers.authorization : ''
    const secretKey: string = process.env.JWT_SECRET ? process.env.JWT_SECRET : ''

    if (!token) {
      throw new CustomException(401, 'warning', '')
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    jsonWebToken.verify(token, secretKey, (error: VerifyErrors | null, decoded: unknown) => {
      if (error) {
        throw new CustomException(401, 'warning', '')
      }

      nextFunction()
    })
  }
}
