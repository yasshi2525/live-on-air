import { Spot } from './spot'
import { Broadcaster } from './broadcaster'
import { Screen } from './screen'
import { Field } from './field'

/**
 * 生放送 {@link Live} の処理を定義する際、参照可能な値
 */
export interface LiveContext {
  /**
   * 現在の g.Scene が格納されます
   */
  readonly scene: g.Scene
  /**
   * 生放送での描画内容を格納できるエンティティです.
   *
   * 生放送中の描画内容は本エンティティの子に指定してください.
   */
  readonly container: g.E
  /**
   * Broadcaster, Spot を管理するマップ
   */
  readonly field: Field
  /**
   * 全放送情報や描画情報を格納しているスクリーン
   */
  readonly screen: Screen
  /**
   * 生放送が始まるきっかけとなった訪問スポット
   */
  readonly spot: Spot
  /**
   * 放送者（プレイヤー）
   */
  readonly broadcaster: Broadcaster
  /**
   * ライブラリ利用者が自由に使えるフィールドです.
   */
  vars?: unknown
}
