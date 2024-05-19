/*
 * IGenericRepository: Repositoryインタフェースの共通インタフェース(メソッド定義のみ)
 * ※該当しないものはIGenericRepositoryを継承するインタフェースにメソッドを追加してください
 */
export interface IGenericRepository<T> {
  find(keys: Record<string, string>): Promise<T[]>
  findOne(keys: Record<string, string>): Promise<T | null>
  create(item: T): Promise<T>
  update(keys: Record<string, string>, item: T): Promise<T>
  delete(keys: Record<string, string>): Promise<Record<string, string>>
  sort<T extends { keys: Record<string, string>; value: number }>(lists: T[]): Promise<number>
}
