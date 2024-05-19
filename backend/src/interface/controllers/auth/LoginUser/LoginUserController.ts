/*
 * LoginUserController
 * DIの起点のため@injectionし、routerで利用
 */
import { Request, Response, NextFunction } from 'express'
import { injectable, inject } from 'inversify'
import { Types } from '@/settings/inversify/Types'
import Ajv, { ValidateFunction } from 'ajv'
import fs from 'fs'
import path from 'path'
import { CustomException } from '@/settings/CustomException'
import { plainToClass } from 'class-transformer'
import { IGenericController } from '@/domain/utilities/generic-interface/IGenericController'
import { ILoginUserService } from '@/application/services/auth/LoginUser/ILoginUserService'
import { LoginUserDto } from '@/application/dto/auth/LoginUserDto'

@injectable()
export class LoginUserController implements IGenericController {
  private ajv: Ajv
  private paramsValidate: ValidateFunction
  private validate: ValidateFunction
  private loginUserService: ILoginUserService

  constructor(@inject(Types.Ajv) ajv: Ajv, @inject(Types.LoginUserService) loginUserService: ILoginUserService) {
    // Validation
    this.ajv = ajv
    const paramsSchemaPath: string = path.resolve(__dirname, 'loginUser.params.validation.json')
    const paramsSchema: string[] = JSON.parse(fs.readFileSync(paramsSchemaPath, 'utf8'))
    this.paramsValidate = this.ajv.compile(paramsSchema)

    const schemaPath: string = path.resolve(__dirname, 'loginUser.validation.json')
    const schema: string[] = JSON.parse(fs.readFileSync(schemaPath, 'utf8'))
    this.validate = this.ajv.compile(schema)

    // Service
    this.loginUserService = loginUserService

    // Controller method bind
    this.get = this.get.bind(this)
    this.post = this.post.bind(this)
    this.patch = this.patch.bind(this)
    this.delete = this.delete.bind(this)
  }

  // Get
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async get(request: Request, response: Response, nextFunction: NextFunction): Promise<object> {
    try {
      let loginUserDtos: LoginUserDto[] = []

      let test: string = ''

      if (test === '') {
        test = 'test'
      }

      if (!request.params['account']) {
        // Service operation
        loginUserDtos = await this.loginUserService.find({})
      } else {
        // Request -> dto mapping
        const loginUserDto: LoginUserDto = plainToClass(LoginUserDto, request.params, {})

        // validation
        // const isValidate = await this.paramsValidate(loginUserDto)
        // if (!isValidate) throw new CustomException(404, 'warning', '')

        // Keys mapping
        const account: string = loginUserDto['account'] ? loginUserDto['account'] : ''
        const keys: Record<string, string> = { account: account }

        // Service operation
        const resultLoginUserDto: LoginUserDto | null = await this.loginUserService.findOne(keys)

        if (resultLoginUserDto) {
          loginUserDtos.push(resultLoginUserDto)
        }
      }

      // Response
      response.json(loginUserDtos)

      nextFunction()
    } catch (error: unknown) {
      // nextFunctionに進むまでerrorは確認不可
      nextFunction(error)
    }

    return {}
  }

  // Post
  async post(request: Request, response: Response, nextFunction: NextFunction): Promise<object> {
    try {
      // Request -> dto mapping
      const loginUserDto: LoginUserDto = request.body

      // Validation
      const isValidate: boolean = this.validate(loginUserDto)
      if (!isValidate) throw new CustomException(400, 'warning', '')

      // Service operation
      await this.loginUserService.create(loginUserDto)

      // Response
      return { message: '200 OK' }

      nextFunction()
    } catch (error: unknown) {
      nextFunction(error)
    }

    return {}
  }

  // Patch or Sort
  async patch(request: Request, response: Response, nextFunction: NextFunction): Promise<object> {
    try {
      // Update
      if (!Array.isArray(request.body)) {
        // Request -> dto mapping
        const loginUserDto: LoginUserDto = request.body

        // Validation
        const isValidate: boolean = this.validate(request.body)
        if (!isValidate) throw new CustomException(400, 'warning', '')

        // Service operation
        await this.loginUserService.update(loginUserDto)

        // Sort
      } else {
        // Request -> dto mapping
        const loginUserDtos: LoginUserDto[] = request.body

        // Validation
        loginUserDtos.forEach((element: LoginUserDto) => {
          const isValidate: boolean = this.validate(element)
          if (!isValidate) throw new CustomException(400, 'warning', '')
        })

        // Service operation
        await this.loginUserService.sort(loginUserDtos)
      }

      // Response
      return { message: '200 OK' }

      nextFunction()
    } catch (error: unknown) {
      nextFunction(error)
    }

    return {}
  }

  // Delete
  async delete(request: Request, response: Response, nextFunction: NextFunction): Promise<object> {
    try {
      if (request.params['account']) {
        // Request -> dto mapping
        const loginUserDto: LoginUserDto = request.params

        // Validation
        const isValidate: boolean = this.paramsValidate(loginUserDto)
        if (!isValidate) throw new CustomException(400, 'warning', '')

        // Keys mapping
        const account: string = loginUserDto['account'] ? loginUserDto['account'] : ''
        const keys: Record<string, string> = { account: account }

        // Service operation
        await this.loginUserService.delete(keys)

        // Response
        return { message: '200 OK' }

        nextFunction()
      } else {
        throw new CustomException(404, 'warning', '')
      }
    } catch (error: unknown) {
      nextFunction(error)
    }

    return {}
  }
}
