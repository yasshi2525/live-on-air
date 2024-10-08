import { PrimitiveValueSupplier, ValueSupplier, ValueValidator } from './value'

/**
 * {@link NumberLabel} 生成時に利用する設定値
 */
export interface NumberLabelConfig {
  /**
   * 作成する NumberLabel に設定する描画に使用するフォント
   */
  font: g.Font
  /**
   * 作成する NumberLabel に設定する表示桁数
   */
  digit: number
  /**
   * 作成する NumberLabel に設定する前置テキスト
   */
  prefix: string
  /**
   * 作成する NumberLabel に設定する後置テキスト
   */
  suffix: string
}

export class NumberLabelConfigSupplier implements ValueSupplier<NumberLabelConfig> {
  private readonly font: PrimitiveValueSupplier<g.Font>
  private readonly digit: PrimitiveValueSupplier<number>
  private readonly prefix: PrimitiveValueSupplier<string>
  private readonly suffix: PrimitiveValueSupplier<string>

  constructor (initial: NumberLabelConfig) {
    this.font = PrimitiveValueSupplier.create(initial.font)
    this.digit = PrimitiveValueSupplier.create(initial.digit, new class extends ValueValidator<number> {
      override isInvalid (value: number): boolean {
        return value < 0
      }

      override getMessage (value: number): string {
        return super.getMessage(value) + ' 表示桁数は0以上の値でなければなりません.'
      }
    }())
    this.prefix = PrimitiveValueSupplier.create(initial.prefix)
    this.suffix = PrimitiveValueSupplier.create(initial.suffix)
  }

  setIf (obj: Partial<NumberLabelConfig>): void {
    this.font.setIf(obj.font)
    this.digit.setIf(obj.digit)
    this.prefix.setIf(obj.prefix)
    this.suffix.setIf(obj.suffix)
  }

  get (): NumberLabelConfig {
    return {
      font: this.font.get(),
      digit: this.digit.get(),
      prefix: this.prefix.get(),
      suffix: this.suffix.get()
    }
  }

  defaultIf (obj: Partial<NumberLabelConfig>): void {
    this.font.defaultIf(obj.font)
    this.digit.defaultIf(obj.digit)
    this.prefix.defaultIf(obj.prefix)
    this.suffix.defaultIf(obj.suffix)
  }

  default (): NumberLabelConfig {
    return {
      font: this.font.default(),
      digit: this.digit.default(),
      prefix: this.prefix.default(),
      suffix: this.suffix.default()
    }
  }
}
