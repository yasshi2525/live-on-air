import { Live } from './live'

/**
 * コメントを生成するか判定するときに使用可能な環境情報
 */
export interface CommentContext {
  /**
   * 生放送中の場合、生放送インスタンスが格納されます.
   */
  readonly live?: Live
  /**
   * ライブラリ利用者が自由に使えるフィールドです.
   */
  vars?: unknown
}
