import { CommentContext } from './commentContext'
import { PrimitiveValueSupplier, ValueValidator } from '../value/value'

/**
 * 画面上に表示されるコメントを生成します.
 *
 * {@link CommentSupplierBuilder} を使ってインスタンスを作成してください.
 */
export interface CommentSupplier {
  /**
   * コメントが生成された際に発火するトリガ
   */
  readonly onSupply: g.Trigger<string>
  /**
   * コメントの生成間隔 (ミリ秒).
   */
  interval: number

  /**
   * 登録された全コメント.
   */
  readonly comments: readonly string[]

  /**
   * コメントを生成します. 毎tick (1秒間に`g.game.fps`回) 呼び出してください.
   * @param context コメント生成条件の判定に使用する環境情報
   */
  fetch(context: CommentContext): string[]
}

export type CommentCondition = (ctx: CommentContext) => boolean

export interface CommentSchema {
  comment: string,
  conditions: CommentCondition[]
}

export interface CommentSupplierOptions {
  interval: number
  fps: number
  payload: CommentSchema[]
}

export class CommentSupplierImpl implements CommentSupplier {
  readonly onSupply = new g.Trigger<string>()
  readonly comments: readonly string[]
  private _interval: PrimitiveValueSupplier<number>
  private readonly fps: PrimitiveValueSupplier<number>
  private readonly payload: CommentSchema[]
  private indexCount = 0
  private intervalCount = 0
  private current: CommentSchema

  constructor ({ interval, fps, payload }: CommentSupplierOptions) {
    if (payload.length === 0) {
      throw new Error('コメント候補が登録されていません. 1つ以上のエントリを登録してください.')
    }
    this.payload = [...payload]
    this.current = this.payload[0]
    this.comments = this.payload.map(p => p.comment)
    this._interval = PrimitiveValueSupplier.create(interval, new class extends ValueValidator<number> {
      override isInvalid (value: number): boolean {
        return value <= 0
      }

      override getMessage (value: number): string {
        return super.getMessage(value) + ' コメント生成間隔は0より大きな正の値でなければなりません.'
      }
    }())
    this.fps = PrimitiveValueSupplier.create(fps, new class extends ValueValidator<number> {
      override isInvalid (value: number): boolean {
        return value <= 0
      }

      override getMessage (value: number): string {
        return super.getMessage(value) + ' fpsは0より大きな正の値でなければなりません.'
      }
    }())
  }

  fetch (context: CommentContext): string[] {
    const result: string[] = []
    while (this.intervalCount > 0) {
      const tailIndex = this.index - 1
      let matched = false
      while (!(matched = this.match(context)) && !this.loops(tailIndex)) {
        this.next()
      }
      if (matched) {
        result.push(this.comment)
      }
      this.intervalCount -= this._interval.get()
    }
    this.intervalCount += 1000 / this.fps.get()
    return result
  }

  get interval (): number {
    return this._interval.get()
  }

  set interval (value: number) {
    this._interval.setIf(value)
  }

  private next (): CommentSchema {
    this.indexCount++
    return this.schema
  }

  private match (context: CommentContext): boolean {
    return this.schema.conditions.reduce((prev, current) => !prev ? false : current(context), true)
  }

  private loops (index: number): boolean {
    return this.index === index % this.payload.length
  }

  private get index (): number {
    return this.indexCount % this.payload.length
  }

  private get schema (): CommentSchema {
    return this.payload[this.index]
  }

  private get comment (): string {
    return this.schema.comment
  }
}
