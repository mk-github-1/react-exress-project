// webpackでビルドのみの設定
// eslint-disable-next-line @typescript-eslint/typedef
const path = require('path')
const nodeExternals = require('webpack-node-externals')
// const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
  // モード値を production に設定すると最適化された状態で、
  // development に設定するとソースマップ有効でJSファイルが出力される
  mode: 'development',
  devtool: 'source-map', // または 'inline-source-map' など
  target: 'node',
  externals: [nodeExternals()], // node_modulesを除外する

  // エントリーポイント
  entry: path.resolve('src', 'index.ts'),

  // ファイルの出力設定
  output: {
    path: path.resolve('dist'),
    filename: 'main.js'
  },

  // モジュール設定
  module: {
    rules: [
      // TypeScript をコンパイルする
      {
        // 拡張子 .ts の場合
        test: /.ts$/,
        // exclude: /node_modules/,
        loader: 'ts-loader'
      }
      /*,
      {
        test: /\.(?:js|mjs|cjs)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [['@babel/preset-env', { targets: 'defaults' }]]
          }
        }
      }
      */
    ]
  },

  resolve: {
    // ルートを@に設定 (ビルド後には影響しない)
    alias: {
      '@': path.resolve('src')
    },
    // モジュールインポートの拡張子を省略
    extensions: ['.ts', '.js']
  },

  // ビルトインモジュールを外部モジュールとして扱う
  externals: {
    fs: 'commonjs fs',
    https: 'commonjs https',
    path: 'commonjs path'
  },

  // プラグイン設定
  plugins: [
    // コピー
    /*
    new CopyPlugin({
      patterns: [
        { from: path.resolve('src/.env'), to: path.resolve('dist') },
        { from: path.resolve('src', 'package.json'), to: path.resolve('dist') }
      ]
    })
     */
  ],

  // 開発サーバー設定
  devServer: {}
}
