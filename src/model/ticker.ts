import { NumberLabel, NumberLabelImpl, NumberLabelOptions } from './numberLabel'

/**
 * {@link Ticker} の状態.
 *
 * 'enabled': 残り時間の変更を許可します.
 *
 * 'disabled': 残り時間を変更しようとしても無視します.
 */
export type TickerStatus = 'enabled' | 'disabled'

/**
 * ゲームの残り時間を制御、描画します.
 */
export interface Ticker extends NumberLabel {
  /**
   * 残り時間が 0 になった際に発火するトリガ
   */
  readonly onExpire: g.Trigger
  /**
   * 残り時間を取得します. (秒単位、0秒以上、小数点以下切り捨て)
   */
  readonly value: number

  /**
   * 残り時間を取得します. (フレーム単位、負の値あり、小数点以下あり)
   */
  readonly rawValue: number

  /**
   * 残り時間の変更を受け付けるか状態を取得します
   */
  readonly status: TickerStatus

  /**
   * 残り時間の値 (フレーム数) を追加します.
   *
   * カウントダウン形式の場合、引数に負の値を設定してください.
   *
   * @param frame 追加する値 (フレーム数)
   */
  add (frame: number): void

  /**
   * 引数の値に残り時間 (フレーム数) を設定します.
   *
   * @param frame 設定する値
   */
  set (frame: number): void

  /**
   * 残り時間を設定できるようにします.
   */
  enable (): void

  /**
   * 残り時間を設定しようとしても無視します.
   */
  disable (): void
}

export type TickerOptions = Omit<NumberLabelOptions, 'value' | 'textAlign'> & {
  frame: number
}

export class TickerImpl extends NumberLabelImpl implements Ticker {
  readonly onExpire = new g.Trigger()
  constructor ({ scene, frame, font, digit, prefix, suffix }: TickerOptions) {
    super({ scene, value: frame, font, digit, prefix, suffix, textAlign: 'left' })
    scene.onUpdate.add(() => {
      if (this.status === 'enabled') {
        this.add(-1)
      }
      if (this.rawValue <= 0) {
        this.disable()
        this.onExpire.fire()
      }
    })
  }

  override get value (): number {
    return Math.max(Math.floor(super.value / g.game.fps), 0)
  }

  get rawValue (): number {
    return super.value
  }
}
