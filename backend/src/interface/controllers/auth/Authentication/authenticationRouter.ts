/*
 * authenticationRouter
 * ルーティング設定 & DIからcontrollerを取り出しDI利用開始の設定
 */
import express, { Router } from 'express'
// import { StatusCodes } from "http-status-codes";
import { container } from '@/settings/inversify/inversify.config'
import { Types } from '@/settings/inversify/Types'
import { AuthenticationController } from '@/interface/controllers/auth/Authentication/AuthenticationController'

export const authenticationRouter = (): Router => {
  const router: Router = express.Router()
  const authenticationController: AuthenticationController = container.get<AuthenticationController>(
    Types.AuthenticationController
  )

  router
    .route('/')
    .post(authenticationController.post.bind(authenticationController))
    .patch(authenticationController.patch.bind(authenticationController))

  return router
}
