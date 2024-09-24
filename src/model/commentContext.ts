import { Live } from './live'
import { Broadcaster } from './broadcaster'
import { Field } from './field'
import { Screen } from './screen'
import { Spot } from './spot'

/**
 * コメントを生成するか判定するときに使用可能な環境情報
 */
export interface CommentContext {
  /**
   * 生放送中の場合、生放送インスタンスが格納されます.
   */
  readonly live?: Live
  /**
   * 滞在中の場合、スポットが格納されます.
   */
  readonly staying?: Spot
  /**
   * 放送者
   */
  readonly broadcaster: Broadcaster
  /**
   * 放送者と訪問先が存在するマップ
   */
  readonly field: Field
  /**
   * 生放送画面情報
   */
  readonly screen: Screen
  /**
   * ライブラリ利用者が自由に使えるフィールドです.
   */
  vars?: unknown
}
