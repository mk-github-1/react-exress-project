/*
 * IGenericService: Serviceインタフェースの共通インタフェース(メソッド定義のみ)
 * ※該当しないものはIGenericServiceを継承するインタフェースにメソッドを追加してください
 */
export interface IGenericService<T> {
  find(keys: Record<string, string>): Promise<T[]>
  findOne(keys: Record<string, string>): Promise<T | null>
  create(item: T): Promise<T>
  update(item: T): Promise<T>
  delete(keys: Record<string, string>): Promise<Record<string, string>>
  sort(lists: []): Promise<number>
}
