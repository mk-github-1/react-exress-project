/* LoginView下書き
import { useState } from 'react'
import styled from 'styled-components'
// import Ajv, { type ValidateFunction } from 'ajv'
// import { authenticationService } from '../../services/auth/authenticationService'
import type { Authentication } from '../types/auth/Authentication/Authentication'

export const LoginView = (): JSX.Element => {
  // Vueのmounted相当
  // const [account, password] = useState(0)
  const account: string = ''
  const password: string = ''
  const rePassword: string = ''

  // validaiton setting
  const ajv: Ajv = new Ajv()
  // const schemaPath = './auth/Authentication/authentication.validation.json'

  // ★fsでなくimportから取得できる？
  // const schema: unknown = JSON.parse(fs.readFileSync(schemaPath, 'utf8'))
  // const validate: ValidateFunction = ajv.compile(schema)

  const onLogin = async (): Promise<void> => {
    const postType: number = 0

    // organismsに分ける
    const authentication: Authentication = {
      account: account,
      password: password,
      rePassword: '',
      postType: postType
    }

    // validationパターンが異なる
      const isValidate = await validate(authentication)
      if (!isValidate) {
        // output validation message
        return
      }

    // serviceに分ける
      await authenticationService()
        .login(authentication)
        .then((success: any) => {
          // success
        })
        .catch((failure: any) => {
          // failure
        })
  }

  const onNewRegister = async (): void => {
    const postType: number = 1

    // organismsに分ける
    const authentication: Authentication = {
      account: account,
      password: password,
      rePassword: rePassword,
      postType: postType
    }

    // validationパターンが異なる
      const isValidate = await validate(authentication)
      if (!isValidate) {
        // output validation message
        return
      }

    // serviceに分ける
      await authenticationService()
        .post(authentication)
        .then((success: any) => {
          // success
        })
        .catch((failure: any) => {
          // failure
        })
  }

  const onForgetPassword = async () => {
    const postType: number = 2

    // organismsに分ける
    const authentication: Authentication = {
      account: this.account,
      password: '',
      rePassword: '',
      postType: postType
    }

    // validationパターンが異なる
      const isValidate = await validate(authentication)
      if (!isValidate) {
        // output validation message
        return
      }

    // serviceに分ける
      await authenticationService()
        .patch(authentication)
        .then((success: any) => {
          // success
        })
        .catch((failure: any) => {
          // failure
        })
  }

  return (
    <div className="content-container">
      <div className="card">
        <h1 className="h3 mb-3 fw-normal">ログイン</h1>
        <div className="content-item">
          <label className="form-label" /* style="width: 200px" */>Emailアドレス</label>
          <input
            type="email"
            className="form-control form-control-sm"
            placeholder="name@example.com"
            // autocomplete="new-password"
            value={account}
          />
        </div>
        <div className="content-item">
          <label className="form-label" /* style="width: 200px" */>パスワード</label>
          <input
            type="password"
            className="form-control form-control-sm"
            placeholder="パスワード"
            // autocomplete="new-password"
            value={password}
          />
        </div>
        <div className="content-item-right">
          <button
            className="btn btn-primary btn-sm"
            /* style="width: 120px" */ v-on:click="onLogin"
          >
            ログイン
          </button>
        </div>
        <div className="content-item-right">
          <input type="checkbox" className="form-input form-input-sm m-1" />
          <label className="form-label">状態を記憶する</label>
        </div>
      </div>
    </div>
  )
}
*/

/*
<!-- 3.style -->
<style scoped>
.content-container {
  display: grid;
  justify-content: center;
  grid-template-columns: 500px;
}

.content-item {
  display: flex;
  padding: 10px;
}

.content-item-right {
  display: flex;
  margin-left: auto;
  padding: 10px;
}

.card {
  padding: 10px;
}

.form-label {
  display: inline-block;
}
</style>
@/services/auth/authenticationService
 */
