/* service下書き
import axios, { type AxiosResponse } from 'axios'
import { loginUserStore } from '@/stores/loginUserStore'
import type { LoginUser } from '@/types/auth/LoginUser/LoginUser'
import type { Authentication } from '@/types/auth/Authentication/Authentication'

export const authenticationService = () => {
  // const frontendBaseUrl = 'http://localhost:5173'
  const backendBaseUrl = 'http://localhost:3000/api'
  const url = backendBaseUrl + '/authentications'

  // login (ログインはパスワードを含むためPOSTでアクセス)
  const login = async (authentication: Authentication) => {
    await axios({
      method: 'post',
      url: url,
      data: authentication,
      headers: {
        // Authorization: `Bearer ${token}`, // ログイン後はJWTトークンをBearerスキームで送信する
        'Content-Type': 'application/json',
        Origin: backendBaseUrl
      }
    })
      .then((response: AxiosResponse<any, any>) => {
        // レスポンスの処理
        const { loginUserDto } = response.data
        const loginUser: LoginUser = loginUserDto as LoginUser

        // loginUserStoreに保存
        const store: any = loginUserStore()
        store.set(loginUser)

        // 画面遷移の処理
      })
      .catch((response: AxiosResponse<any, any>) => {
        // レスポンス(エラー)の処理
      })
  }

  // post  // account: string, password: string, rePassword: string
  const post = async (authentication: Authentication) => {
    await axios({
      method: 'post',
      url: url,
      data: authentication,
      headers: {
        'Content-Type': 'application/json',
        Origin: backendBaseUrl
      }
    })
      .then((response: AxiosResponse<any, any>) => {
        // レスポンスの処理
      })
      .catch((response: AxiosResponse<any, any>) => {
        // レスポンス(エラー)の処理
      })
  }

  // patch
  const patch = async (authentication: Authentication) => {
    await axios({
      method: 'patch',
      url: url,
      data: authentication,
      headers: {
        'Content-Type': 'application/json',
        Origin: backendBaseUrl
      }
    })
      .then((response: AxiosResponse<any, any>) => {
        // レスポンスの処理
      })
      .catch((response: AxiosResponse<any, any>) => {
        // レスポンス(エラー)の処理
      })
  }

  return {
    login,
    post,
    patch
  }
}
 */
