/*
 * loginUserRouter
 * ルーティング設定 & DIからcontrollerを取り出しDI利用開始の設定
 */
import express, { Router } from 'express'
// import { StatusCodes } from "http-status-codes";
import { container } from '@/settings/inversify/inversify.config'
import { Types } from '@/settings/inversify/Types'
import { LoginUserController } from '@/interface/controllers/auth/LoginUser/LoginUserController'

export const loginUserRouter = (): Router => {
  const router: Router = express.Router()
  const loginUserController: LoginUserController = container.get<LoginUserController>(Types.LoginUserController)

  router.route('/:keys').get(loginUserController.get.bind(LoginUserController))

  router
    .route('/')
    .get(loginUserController.get.bind(LoginUserController))
    .post(loginUserController.post.bind(LoginUserController))
    .patch(loginUserController.patch.bind(LoginUserController))

  router.route('/:keys').delete(loginUserController.delete.bind(LoginUserController))

  return router
}
