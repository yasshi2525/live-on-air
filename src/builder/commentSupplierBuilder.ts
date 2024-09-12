import { CommentSchema, CommentSupplier, CommentSupplierImpl } from '../model/commentSupplier'
import { CommentContext } from '../model/commentContext'
import { PrimitiveValueSupplier, ValueValidator } from '../value/value'

/**
 * コメント生成器 ({@link CommentSupplier}) を簡便に作るためのクラス.
 *
 * CommentSupplier は本クラスを用いて作成してください.
 */
export class CommentSupplierBuilder {
  private readonly queue: CommentSchema[] = []
  private readonly fps: number
  private readonly _interval: PrimitiveValueSupplier<number>

  constructor (game: g.Game) {
    this.fps = game.fps
    this._interval = PrimitiveValueSupplier.create(1000, new class extends ValueValidator<number> {
      override isInvalid (value: number): boolean {
        return value <= 0
      }

      override getMessage (value: number): string {
        return super.getMessage(value) + ' コメント生成間隔は0より大きな正の値でなければなりません.'
      }
    }())
  }

  /**
   * コメントの生成間隔(ミリ秒)の初期値を取得します.
   */
  interval(): number
  /**
   * コメントの生成間隔(ミリ秒)の初期値を設定します.
   * @param value 生成間隔の初期値
   */
  interval(value: number): CommentSupplierBuilder

  interval (args?: number): number | CommentSupplierBuilder {
    if (typeof args === 'number') {
      this._interval.setIf(args)
      return this
    }
    return this._interval.get()
  }

  /**
   * 出力するコメントを登録します.
   *
   * @param comment コメント本文
   * @param conditions コメントを出力する条件(複数指定可). 省略した場合、状況にかかわらず出力します.
   */
  add (comment: string, ...conditions: ((ctx: CommentContext) => boolean)[]): CommentSupplierBuilder {
    this.queue.push({
      comment,
      conditions: [...conditions]
    })
    return this
  }

  /**
   * CommentSupplier を作成します.
   */
  build (): CommentSupplier {
    return new CommentSupplierImpl({ payload: this.queue, fps: this.fps, interval: this._interval.get() })
  }
}
