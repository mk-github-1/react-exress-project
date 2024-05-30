/*
 * router.ts: ルーティング設定
 * index.tsでマウントするルータを別ファイル化、Controller単位のルータを登録
 */
import express, { Router } from 'express'

// auth
import { authenticationRouter } from '@/interface/controllers/auth/Authentication/authenticationRouter'
import { loginUserRouter } from '@/interface/controllers/auth/LoginUser/loginUserRouter'

// master

// transaction

export const routes = (): Router => {
  const router: Router = express.Router()

  // ルート名は複数系にする

  /* auth **************************************************/
  router.use('/authentications', authenticationRouter())
  router.use('/loginUsers', loginUserRouter())

  /* master **************************************************/
  // (例) router.use("/groups", GroupController());

  /* transaction **************************************************/
  // (例) routes.use("/managements", ManagementController());

  /* transaction(etc) **************************************************/

  return router
}
