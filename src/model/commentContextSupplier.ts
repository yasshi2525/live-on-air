import { Broadcaster } from './broadcaster'
import { Field } from './field'
import { CommentContext } from './commentContext'
import { Screen } from './screen'

/**
 * {@link CommentContextSupplier} の初期化に必要なパラメタ
 */
export interface CommentContextSupplierOptions {
  /**
   * 放送者
   */
  broadcaster: Broadcaster
  /**
   * 放送者と訪問先が存在するマップ
   */
  field: Field
  /**
   * 生放送画面情報
   */
  screen: Screen
}

/**
 * {@link CommentContext} を環境情報から生成します.
 */
export class CommentContextSupplier {
  private readonly _broadcaster: Broadcaster
  private readonly _field: Field
  private readonly _screen: Screen

  constructor ({ broadcaster, field, screen }: CommentContextSupplierOptions) {
    this._broadcaster = broadcaster
    this._field = field
    this._screen = screen
  }

  /**
   * CommentContext を生成します.
   */
  get (): CommentContext {
    return {
      live: this._broadcaster.live
    }
  }
}
