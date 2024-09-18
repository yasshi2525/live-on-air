import { TickerConfig, TickerConfigSupplier } from '../value/tickerConfig'
import { Ticker, TickerImpl } from '../model/ticker'

/**
 * {@link Ticker} を新規作成する際の各種設定を保持します.
 */
export interface TickerConfigure {
  /**
   * 作成する Ticker に設定する残り時間の初期値 (フレーム数) を取得します.
   */
  frame (): number

  /**
   * 作成する Ticker に設定する残り時間の初期値 (フレーム数) を設定します.
   *
   * @param frame 残り時間の初期値 (フレーム数)
   */
  frame (frame: number): TickerConfigure

  /**
   * 作成する Ticker に設定するフォントを取得します.
   */
  font (): g.Font

  /**
   * 作成する Ticker に設定するフォントを設定します.
   *
   * @param font 描画に使用するフォント
   */
  font (font: g.Font): TickerConfigure

  /**
   * 作成する Ticker に設定する残り時間の桁数を取得します.
   */
  digit (): number

  /**
   * 作成する Ticker に設定する残り時間の桁数を設定します.
   *
   * @param digit 残り時間の桁数
   */
  digit (digit: number): TickerConfigure

  /**
   * 作成する Ticker に設定する前置テキストを取得します.
   */
  prefix (): string

  /**
   * 作成する Ticker に設定する前置テキストを設定します.
   *
   * @param prefix 前置テキスト
   */
  prefix (prefix: string): TickerConfigure

  /**
   * 作成する Ticker に設定する後置テキストを取得します.
   */
  suffix (): string

  /**
   * 作成する Ticker に設定する後置テキストを設定します.
   *
   * @param suffix 後置テキスト
   */
  suffix (suffix: string): TickerConfigure

  /**
   * 作成する Ticker のライブラリ利用者が自由に使えるフィールドを取得します.
   */
  vars (): unknown

  /**
   * 作成する Ticker のライブラリ利用者が自由に使えるフィールドを設定します.
   *
   * @param vars ライブラリ利用者が自由に使えるフィールド
   */
  vars (vars: unknown): TickerConfigure
}

export class TickerConfigureImpl implements TickerConfigure {
  private readonly getter: () => TickerConfig
  private readonly setter: (obj: Partial<TickerConfig>) => void

  constructor (isDefault: boolean, private readonly scene: g.Scene, private readonly config: TickerConfigSupplier) {
    this.getter = () => isDefault ? config.default() : config.get()
    this.setter = obj => isDefault ? config.defaultIf(obj) : config.setIf(obj)
  }

  frame (): number

  frame (initial: number): TickerConfigure

  frame (args?: number): number | TickerConfigure {
    if (typeof args === 'number') {
      this.setter({ frame: args })
      return this
    }
    return this.getter().frame
  }

  font (): g.Font

  font (font: g.Font): TickerConfigure

  font (args?: g.Font): g.Font | TickerConfigure {
    if (args) {
      this.setter({ font: args })
      return this
    }
    return this.getter().font
  }

  digit (): number

  digit (digit: number): TickerConfigure

  digit (args?: number): number | TickerConfigure {
    if (typeof args === 'number') {
      this.setter({ digit: args })
      return this
    }
    return this.getter().digit
  }

  prefix (): string

  prefix (prefix: string): TickerConfigure

  prefix (args?: string): string | TickerConfigure {
    if (args) {
      this.setter({ prefix: args })
      return this
    }
    return this.getter().prefix
  }

  suffix (): string

  suffix (suffix: string): TickerConfigure

  suffix (args?: string): string | TickerConfigure {
    if (args) {
      this.setter({ suffix: args })
      return this
    }
    return this.getter().suffix
  }

  vars (): unknown

  vars (vars: unknown): TickerConfigure

  vars (args?: unknown): unknown | TickerConfigure {
    if (arguments.length > 0) {
      this.setter({ vars: args })
      return this
    }
    return this.getter().vars
  }

  /**
   * 指定された設定で {@link Ticker} を作成します.
   */
  build (): Ticker {
    const config = this.config.get()
    return new TickerImpl({ scene: this.scene, frame: this.frame(), font: this.font(), digit: config.digit, prefix: config.prefix, suffix: config.suffix, vars: config.vars })
  }
}
