## EntityManager API メモ

使用方法はこのページの記載のとおり
https://typeorm.io/entity-manager-api

方法はいろいろあるが、サンプルプロジェクトでメインで使用するメソッドは下記としている

> // findBy: 複数件
> 例: await this.entityManager.findBy(LoginUserEntity, {})
>
> // findOneBy: 1 件
> 例:
> await this.entityManager.findOneBy(LoginUserEntity, {
> account: account
> })
>
> // create: 削除
> 例: await this.entityManager.create(LoginUserEntity, loginUserEntity)
>
> // update: 更新
> 例: await this.entityManager.update(LoginUserEntity, [account], loginUserEntity)
>
> // findOneBy -> update: 論理削除
> 例:
> let loginUserEntity: LoginUserEntity | null = await this.entityManager.findOneBy(LoginUserEntity, {
> account: account
> })
>
> if (loginUserEntity) {
> loginUserEntity.isDeleted = true
> await this.entityManager.update(LoginUserEntity, [account], loginUserEntity)
> }
>
> // delete: 物理削除
> 例: await this.entityManager.delete(LoginUserEntity, [account])
>
> // query: sql 直接実行
> 例: await this.entityManager.query(sql, params)

## EntityManager API メソッド一覧

EntityManager API の日本語訳と、よく利用するものをまとめた。

Service - Repository パターンを使用して CRUD を構築すると、◎ の機能のみで DB 操作はほぼ実行できる

TypeORM の利用に依存しすぎないため、最小限の利用にした

| メソッド名                                      | 説明 ※◎: 利用する、△: 利用頻度は低い or 避ける、×: 利用しない、-: 対象外           |
| :---------------------------------------------- | :--------------------------------------------------------------------------------- |
| manager.dataSource                              | - EntityManager によって使用されるデータソース                                     |
| manager.queryRunner                             | - EntityManager によって使用される クエリを実行(トランザクション有り)              |
| manager.transaction(async (manager) => { ... }) | ◎ トランザクション                                                                 |
| manager.query(`SELECT * FROM ...`)              | △ 生の SQL クエリを実行                                                            |
| manager.createQueryBuilder() ...                | △ SQL クエリの構築に使用するクエリ ビルダーを作成                                  |
| manager.hasId(...)                              | △ 指定されたエンティティにプライマリ列プロパティが定義されているかどうかを確認     |
| manager.getId(...)                              | △ 指定されたエンティティのプライマリ列プロパティ値を取得                           |
| manager.create(User)                            | △ 新しいインスタンスを作成します                                                   |
| manager.create(User, { ... })                   | ↓                                                                                  |
| manager.merge(User, ..., { ... }, { ... })      | × 複数のエンティティを 1 つのエンティティにマージ                                  |
| manager.preload(User, partialUser)              | × 指定されたプレーンな JavaScript オブジェクトから新しいエンティティを作成         |
| manager.save(user)                              | × 指定されたエンティティまたはエンティティの配列を保存                             |
| manager.save([..., ...])                        | ↓                                                                                  |
| manager.remove(user)                            | × 指定されたエンティティまたはエンティティの配列を削除                             |
| manager.remove([..., ...])                      | ↓                                                                                  |
| manager.insert(User, { ... })                   | ◎ 新しいエンティティ、またはエンティティの配列を挿入                               |
| manager.insert(User, [{ ... }, { ... }])        | ↓                                                                                  |
| manager.update(User, { ... }, { ... })          | ◎ 指定された更新オプションまたはエンティティ ID によってエンティティを部分的に更新 |
| manager.update(User, 1, { ... })                | ↓                                                                                  |
| manager.delete(User, 1)                         | ◎ エンティティ ID、ID、または指定された条件によってエンティティを削除              |
| manager.delete(User, [1, 2, 3])                 | ↓                                                                                  |
| manager.delete(User, { ... })                   | ↓                                                                                  |
| manager.increment(User, { ... }, "age", 3)      | × 指定されたオプションに一致するエンティティの指定された値によって一部の列を増分   |
| manager.decrement(User, { ... }, "age", 3)      | × 指定されたオプションに一致する指定された値によって一部の列をデクリメント         |
| manager.exists(User, {where: { ... }})          | × 一致するエンティティが存在するかどうかを確認                                     |
| manager.existsBy(User, { ... })                 | △ 一致するエンティティが存在するかどうかを確認                                     |
| manager.count(User, {where: { ... }})           | × 一致するエンティティをカウント                                                   |
| manager.countBy(User, { ... })                  | △ 一致するエンティティをカウント(FindOptions: where)                               |
| manager.find(User, { where: { ... }})           | × 指定された に一致するエンティティを検索                                          |
| manager.findBy(User, { ... })                   | ◎ 指定された に一致するエンティティを検索 (FindOptions: where)                     |
| manager.findAndCount(User, { where: { ... }})   | × 指定された に一致するエンティティを検索 + カウント                               |
| manager.findAndCountBy(User, { ... })           | × 指定された に一致するエンティティを検索 + カウント (FindOptions: where)          |
| manager.findOne(User, { where: { ... }})        | × 指定された に一致する最初のエンティティを検索                                    |
| manager.findOneBy(User, { ... })                | ◎ 指定された に一致する最初のエンティティを検索 (FindOptions: where)               |
| manager.findOneOrFail(User, { ... })            | × 指定された に一致する最初のエンティティを検索 (FindOptions: where)               |
| manager.clear(User)                             | × 指定されたテーブルからすべてのデータをクリア                                     |
| manager.getTreeRepository(User)                 | × 特定のエンティティに対して操作を実行                                             |
| manager.getMongoRepository(User)                | × 特定のエンティティに対して操作を実行 (MongoDB)                                   |
| manager.withRepository(UserRepository)          | × トランザクションで使用されるカスタム リポジトリ インスタンスを取得               |
| manager.release()                               | × エンティティ マネージャーのクエリ ランナーを解放                                 |

(メモ)

getId, hasId, exists-> findOne の結果で兼ねる

save -> insert, update に分けて利用する

remove -> delete のほうが正確

upsert -> トランザクション内の insert, update, delete を兼ねる

countBy -> find 結果の件数を兼ねる
