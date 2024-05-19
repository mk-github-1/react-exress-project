/*
 * CustomException: This class is extends standard "Error" and adds "http status code" and "log level".
 *
 */
export class CustomException extends Error {
  httpStatusCode: number
  logLevel: string

  constructor(httpStatusCode: number, logLevel: string, message: string) {
    super(message)
    this.httpStatusCode = httpStatusCode
    this.logLevel = logLevel
  }
}
