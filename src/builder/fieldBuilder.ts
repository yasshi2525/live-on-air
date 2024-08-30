import { Field, FieldImpl } from '../model/field'

/**
 * マップ Field を簡便に作るためのクラス.
 *
 * Field は本クラスを用いて作成してください.
 */
export class FieldBuilder {
  /**
   * field を作成します.
   */
  build (): Field {
    return new FieldImpl({ x: 0, y: 0, width: 100, height: 100 })
  }
}
