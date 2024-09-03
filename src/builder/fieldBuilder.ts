import { Field, FieldImpl } from '../model/field'

/**
 * マップ ({@link Field}) を簡便に作るためのクラス.
 *
 * Field は本クラスを用いて作成してください.
 */
export class FieldBuilder {
  /**
   * Field を作成します.
   */
  build (): Field {
    return new FieldImpl()
  }
}
