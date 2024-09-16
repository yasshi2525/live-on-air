import { PrimitiveValueSupplier, ValueSupplier, ValueValidator } from './value'
import { NumberLabelConfig, NumberLabelConfigSupplier } from './numberLabelConfig'

/**
 * {@link Ticker} 生成時に利用する設定値
 */
export interface TickerConfig extends NumberLabelConfig {
  /**
   * 作成する Ticker に設定する残り時間の初期値 (フレーム)
   */
  frame: number
  /**
   * 作成する Ticker に設定する描画に使用するフォント
   */
  font: g.Font
  /**
   * 作成する Ticker に設定する表示桁数
   */
  digit: number
  /**
   * 作成する Ticker に設定する前置テキスト
   */
  prefix: string
  /**
   * 作成する Ticker に設定する後置テキスト
   */
  suffix: string
}

export class TickerConfigSupplier extends NumberLabelConfigSupplier implements ValueSupplier<TickerConfig> {
  private readonly frame: PrimitiveValueSupplier<number>

  constructor (initial: TickerConfig) {
    super(initial)
    this.frame = PrimitiveValueSupplier.create(initial.frame, new class extends ValueValidator<number> {
      override isInvalid (value: number): boolean {
        return value <= 0
      }

      override getMessage (value: number): string {
        return super.getMessage(value) + ' 残り時間(フレーム数)は0より大きな値でなければなりません.'
      }
    }())
  }

  override setIf (obj: Partial<TickerConfig>): void {
    super.setIf(obj)
    this.frame.setIf(obj.frame)
  }

  override get (): TickerConfig {
    return {
      ...super.get(),
      frame: this.frame.get()
    }
  }

  override defaultIf (obj: Partial<TickerConfig>): void {
    super.defaultIf(obj)
    this.frame.defaultIf(obj.frame)
  }

  override default (): TickerConfig {
    return {
      ...super.default(),
      frame: this.frame.default()
    }
  }
}
