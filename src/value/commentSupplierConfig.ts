import { ArraySupplier, PrimitiveValueSupplier, ValueSupplier, ValueValidator } from './value'
import { CommentSchema } from '../model/commentSupplier'

/**
 * {@link CommentSupplier} 生成時に利用する設定値
 */
export interface CommentSupplierConfig {
  /**
   * 作成する CommentSupplier に設定する、コメントの生成間隔 (ミリ秒)
   */
  interval: number
  /**
   * 作成する CommentSupplier に設定する、コメント情報
   */
  comments: CommentSchema[]
}

/**
 * {@link CommentSupplier} 生成に必要な属性値を設定します.
 */
export class CommentSupplierConfigSupplier implements ValueSupplier<CommentSupplierConfig> {
  private readonly interval: PrimitiveValueSupplier<number>
  private readonly comments: ArraySupplier<CommentSchema>

  constructor (initial: CommentSupplierConfig) {
    this.interval = PrimitiveValueSupplier.create(initial.interval, new class extends ValueValidator<number> {
      override isInvalid (value: number): boolean {
        return value <= 0
      }

      override getMessage (value: number): string {
        return super.getMessage(value) + ' コメント生成間隔は0より大きな正の値でなければなりません.'
      }
    }())
    this.comments = ArraySupplier.create(initial.comments)
  }

  setIf (obj: Partial<CommentSupplierConfig>): void {
    this.interval.setIf(obj.interval)
    this.comments.setIf(obj.comments)
  }

  addComment (comment: CommentSchema): void {
    this.comments.add(comment)
  }

  get (): CommentSupplierConfig {
    return {
      interval: this.interval.get(),
      comments: this.comments.get()
    }
  }

  addDefaultComment (comment: CommentSchema): void {
    this.comments.addDefault(comment)
  }

  defaultIf (obj: Partial<CommentSupplierConfig>):void {
    this.interval.defaultIf(obj.interval)
    this.comments.defaultIf(obj.comments)
  }

  default (): CommentSupplierConfig {
    return {
      interval: this.interval.default(),
      comments: this.comments.default()
    }
  }
}
