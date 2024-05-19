/**
 * TypeORMの楽観的ロック制御
 *
 */
import { EventSubscriber, EntitySubscriberInterface, UpdateEvent, OptimisticLockVersionMismatchError } from 'typeorm'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const EXPECTED_UPDATE_METADATA: any = Symbol()

@EventSubscriber()
export class ConcurrencySubscriber implements EntitySubscriberInterface {
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  beforeUpdate(event: UpdateEvent<unknown>): void {
    // We only deal with entities which have a update datetime.
    // To know if an entity has a version number, we check if versionColumn
    // It is defined in the metadatas of that entity.
    // 更新日時を持つエンティティのみを扱います。
    // エンティティに更新日時があるかどうかを確認するには、updateColumn かどうかを確認します。
    // それはエンティティのメタデータで定義されます。
    if (event.entity && event.metadata.updateDateColumn) {
      // Getting the current datetime of the entity
      // エンティティの現在の更新日時を取得します
      // const currentUpdateDateTime = Reflect.get(event.entity, event.metadata.updateDateColumn.propertyName)

      // Getting the version we expect after the datetime
      // We memorize the expected version as a metadata on the entity
      // 更新後に予想される更新日時を取得します
      // 期待される更新日時をエンティティのメタデータとして記憶します
      const expectedVersionAfterUpdateTime: DateConstructor = Date
      Reflect.defineMetadata(EXPECTED_UPDATE_METADATA, expectedVersionAfterUpdateTime, event.entity)
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  afterUpdate(event: UpdateEvent<unknown>): void {
    // We only deal with entities which have a update datetime.
    // To know if an entity has a version number, we check if versionColumn
    // It is defined in the metadatas of that entity.
    // 更新日時を持つエンティティのみを扱います。
    // エンティティに更新日時があるかどうかを確認するには、updateColumn かどうかを確認します。
    // それはエンティティのメタデータで定義されます。
    if (event.entity && event.metadata.updateDateColumn) {
      // We retrieve the expected update datetime previously memorized as a metadata on the entity
      // エンティティのメタデータとして以前に記憶されていた予期される更新日時を取得します
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const expectedUpdateDateTime: any = Reflect.getOwnMetadata(EXPECTED_UPDATE_METADATA, event.entity)

      // We don't need that metadata anymore, we delete it
      // そのメタデータはもう必要ないので削除します
      Reflect.deleteMetadata(EXPECTED_UPDATE_METADATA, event.entity)

      // Getting the actual update datetime of the entity
      // エンティティの実際の日時を取得します
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const actualUpdateDateTime: any = Reflect.get(event.entity, event.metadata.updateDateColumn.propertyName)

      // We check if there is update datetime mismatch
      // 更新日時の不一致があるかどうかを確認します
      if (expectedUpdateDateTime != actualUpdateDateTime) {
        throw new OptimisticLockVersionMismatchError('409 Conflict', expectedUpdateDateTime, actualUpdateDateTime)
      }
    }
  }
}
