/*
 * AuthenticationController
 * DIの起点のため@injectionし、routerで利用
 */
import { Request, Response, NextFunction } from 'express'
import Ajv, { ValidateFunction } from 'ajv'
import bcrypt from 'bcrypt'
import fs from 'fs'
import path from 'path'
import { sign } from 'jsonwebtoken'
import { injectable, inject } from 'inversify'
import { Types } from '@/settings/inversify/Types'
import { CustomException } from '@/settings/CustomException'
import { IAuthenticationService } from '@/application/services/auth/Authentication/IAuthenticationService'
import { AuthenticationDto } from '@/application/dto/auth/AuthenticationDto'

@injectable()
export class AuthenticationController {
  private ajv: Ajv
  private validate: ValidateFunction
  private authenticationService: IAuthenticationService

  constructor(
    @inject(Types.Ajv) ajv: Ajv,
    @inject(Types.AuthenticationService) authenticationService: IAuthenticationService
  ) {
    // Validation
    this.ajv = ajv
    const schemaPath: string = path.resolve(__dirname, 'authentication.validation.json')
    const schema: string[] = JSON.parse(fs.readFileSync(schemaPath, 'utf8'))
    this.validate = this.ajv.compile(schema)

    // Service
    this.authenticationService = authenticationService

    // Controller method bind
    this.post = this.post.bind(this)
    this.patch = this.patch.bind(this)
  }

  // Post ※ログインはパスワードを含むためgetでなくpostで送信が必要
  async post(request: Request, response: Response, nextFunction: NextFunction): Promise<object> {
    try {
      // Request -> dto mapping
      const authenticationDto: AuthenticationDto = request.body

      // Validation ■ error時にfront側でメッセージを表示できるようにする
      // const isValidate = await this.validate(authenticationDto)
      // if (!isValidate) throw new CustomException(400, 'warning', '')

      // Post type
      if (authenticationDto.postType === 1) {
        // Keys mapping
        const account: string = authenticationDto.account
        const password: string = authenticationDto.password ? authenticationDto.password : ''
        const keys: Record<string, string> = { account: account, password: password }

        // Service operation
        const resultAuthenticationDto: AuthenticationDto = await this.authenticationService.authentication(keys)

        // パスワードをbcriptで比較
        const passwordFromDatabase: string = resultAuthenticationDto['password']
          ? resultAuthenticationDto['password']
          : 'xxxx'
        const isPasswordCorrect: boolean = await bcrypt.compare(password, passwordFromDatabase)

        if (!isPasswordCorrect) {
          // 指定回数でアカウントをロックする (キャッシュで記録？DBで記録？)
          // 一定期間を過ぎたら解除したい
          const loginAttempts: number = request.cookies.loginAttempts ? parseInt(request.cookies.loginAttempts) : 0
          response.cookie('loginAttempts', loginAttempts + 1, { maxAge: 900000, httpOnly: true })
          throw new CustomException(401, 'warning', '')
        }

        // 2段階認証も必要

        // Create jsonWebToken
        const payload: Record<string, string> = { account: account }
        const jsonWebToken: string = sign(payload, 'JWT_SECRET_KEY', { expiresIn: '8h' })

        // Response
        response.setHeader('Authorization', `Bearer ${jsonWebToken}`)
        response.json(resultAuthenticationDto)
      } else {
        // Service operation
        await this.authenticationService.create(authenticationDto)

        // Response
        return { message: '200 OK' }
      }

      nextFunction()
    } catch (error: unknown) {
      nextFunction(error)
    }

    return {}
  }

  // Patch
  async patch(request: Request, response: Response, nextFunction: NextFunction): Promise<object> {
    try {
      // Request -> dto mapping
      const authenticationDto: AuthenticationDto = request.body

      // Validation
      const isValidate: boolean = await this.validate(authenticationDto)
      if (!isValidate) throw new CustomException(400, 'warning', '')

      // Service operation
      await this.authenticationService.update(authenticationDto)

      // Response
      return { message: '200 OK' }

      nextFunction()
    } catch (error: unknown) {
      nextFunction(error)
    }

    return {}
  }
}
