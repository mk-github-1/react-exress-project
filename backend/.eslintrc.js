module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'eslint-config-prettier'],
  env: {
    es6: true,
    node: true
  },
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  ignorePatterns: ['*.txt', '*.csv', '*.html'],
  rules: {
    // デバッグ用のconsole.log()を残さない
    // 'no-console': 'error',

    // 再代入が行われない場合にconstキーワードを強制する
    'prefer-const': 'error',

    // var句を使った変数宣言を許可しない
    '@typescript-eslint/no-unused-vars': 'error',

    // any型を許可しない
    '@typescript-eslint/no-explicit-any': 'error',

    // typedefと競合するのでoff
    '@typescript-eslint/no-inferrable-types': 'off',

    // 型必須
    '@typescript-eslint/typedef': [
      'error',
      {
        variableDeclaration: true,
        memberVariableDeclaration: true,
        propertyDeclaration: true,
        variableDeclarationIgnoreFunction: true,
        arrayDestructuring: true,
        objectDestructuring: true,
        parameter: true,
        arrowParameter: true
      }
    ],

    // 非nullアサーション演算子(!)の使用を許可しない
    '@typescript-eslint/no-non-null-assertion': 'error',

    // as句を使った型アサーションを許可しない
    '@typescript-eslint/consistent-type-assertions': 'error'

    // InterfaceにIプレフィックスをつけることを強制する
    // ない '@typescript-eslint/interface-name-prefix': 'error'

    // 配列の判定にincludesを強制する
    // ない '@typescript-eslint/prefer-includes': 'error'

    // typedefに含んでるっぽい
    // module, function戻り型必須
    // '@typescript-eslint/explicit-module-boundary-types': 'error',
    // '@typescript-eslint/explicit-function-return-type': 'error'
  }
}
