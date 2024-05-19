/*
 * types.ts:  InversifyのDIで用いる識別子を追加
 *
 */

export const Types: Record<string, symbol> = {
  // AppDataSource (TypeORM)
  DataSource: Symbol.for('DataSource'),

  // Ajv (validation)
  Ajv: Symbol.for('Ajv'),

  /* auth **************************************************/

  // Auth
  AuthenticationController: Symbol.for('AuthenticationController'),
  AuthenticationService: Symbol.for('AuthenticationService'),

  // LoginUser
  LoginUserController: Symbol.for('LoginUserController'),
  LoginUserService: Symbol.for('LoginUserService'),
  LoginUserRepository: Symbol.for('LoginUserRepository')

  /* master **************************************************/

  /* transaction **************************************************/

  /* transaction(etc) **************************************************/
}
