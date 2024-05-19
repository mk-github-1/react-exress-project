/*
 * IGenericController: Controllerクラスの共通インタフェース(メソッド定義のみ)
 * ControllerはHTTPメソッドのうち、GET、POST、PATCH、DELETEのみを使用
 */
import { Request, Response, NextFunction } from 'express'

export interface IGenericController {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get(request: Request, response: Response, nextFunction: NextFunction): Promise<object>
  post(request: Request, response: Response, nextFunction: NextFunction): Promise<object>
  patch(request: Request, response: Response, nextFunction: NextFunction): Promise<object>
  delete(request: Request, response: Response, nextFunction: NextFunction): Promise<object>
}
