# TypeORM 0.3 メモ

## Entity クラスの設定

Entity クラスでは次のアノテーションをメインで使用

> @Entity クラスが Entity であることを定義
> @PrimaryColumn 主キーカラム
> @PrimaryGeneratedColumn 自動増減の主キーカラム
> @Column テーブルカラム
> @CreateDateColumn データ挿入時に自動で設定されるカラム
> @UpdateDateColumn データ更新時に自動で設定されるカラム
> @OneToOne 1 対 1 の関係を定義するカラム
> @OneToMany 1 対多/多対 1 の関係を定義するカラム
> @JoinColumn 外部キーを持つカラムを定義する
> ※@DeleteDateColumn 日付型になるので使用しない

## コマンドとマイグレーション

### 0.create 空のマイグレーションファイル作成

(Entity クラスから生成する場合は不要)

> npx typeorm-ts-node-commonjs migration:create ./migrations/migration

### 1.generate entity からマイグレーションファイル作成 ※DB 定義のファイル(新規 or 差分)

> npx typeorm-ts-node-commonjs migration:generate -d ./src/data-source.ts ./migrations/migration
> or
> npm run typeorm migration:generate -- --dataSource ./src/data-source.ts --pretty migrations/migration

### 2.run マイグレーション実行

> npx typeorm-ts-node-commonjs migration:run -d ./src/data-source.ts
> or
> npm run typeorm migration:run -- --dataSource ./src/data-source.ts

### 3. 差分更新の方法

差分を更新したい時、再度 1.2 を実行、
リレーション設定でうまく実行できない場合は Entity クラスの見直しが必要

### 4. revert 戻す手順

> npx typeorm-ts-node-commonjs migration:revert -d data-source.ts
> or
> npm run typeorm migration:revert -- --dataSource data-source.ts

### 全部作り直す場合

1.2 を実行するらしいが差分更新がうまくいっていなかった。

### データのインポート

開発中はデータの手動インポート用に Excel で INSERT 文を作るとよい

## テーブルの列をスネークケースにするでチェックしたい

/setteing/typeorm/CustomNamingStrategy.ts を作成して対応済

## 競合チェック(データ 1 件のバージョンを UpdatedAt でチェックしたい)

/setteing/typeorm/ConcurrencySubscriber.ts を作成した、動作は未確認
