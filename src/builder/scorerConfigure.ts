import { ScorerConfig, ScorerConfigSupplier } from '../value/scorerConfig'
import { Scorer, ScorerImpl } from '../model/scorer'

/**
 * {@link Scorer} を新規作成する際の各種設定を保持します.
 */
export interface ScorerConfigure {
  /**
   * 作成する Scorer に設定するフォントを取得します.
   */
  font (): g.Font

  /**
   * 作成する Scorer に設定するフォントを設定します.
   *
   * @param font 描画に使用するフォント
   */
  font (font: g.Font): ScorerConfigure

  /**
   * 作成する Scorer に設定する得点の桁数を取得します.
   */
  digit (): number

  /**
   * 作成する Scorer に設定する得点の桁数を設定します.
   *
   * @param digit 得点の桁数
   */
  digit (digit: number): ScorerConfigure

  /**
   * 作成する Scorer に設定する前置テキストを取得します.
   */
  prefix (): string

  /**
   * 作成する Scorer に設定する前置テキストを設定します.
   *
   * @param prefix 前置テキスト
   */
  prefix (prefix: string): ScorerConfigure

  /**
   * 作成する Scorer に設定する後置テキストを取得します.
   */
  suffix (): string

  /**
   * 作成する Scorer に設定する後置テキストを設定します.
   *
   * @param suffix 後置テキスト
   */
  suffix (suffix: string): ScorerConfigure

  /**
   * 得点をサーバーに送信するかどうか取得します.
   */
  refrainsSendingScore (): boolean

  /**
   * 得点をサーバーに送信するのを控えるかどうか設定します.
   * @param refrains 送信しない場合 true
   */
  refrainsSendingScore (refrains: boolean): ScorerConfigure

  /**
   * 作成する Scorer のライブラリ利用者が自由に使えるフィールドを取得します.
   */
  vars (): unknown

  /**
   * 作成する Scorer のライブラリ利用者が自由に使えるフィールドを設定します.
   *
   * @param vars ライブラリ利用者が自由に使えるフィールド
   */
  vars (vars: unknown): ScorerConfigure
}

export class ScorerConfigureImpl implements ScorerConfigure {
  private readonly getter: () => ScorerConfig
  private readonly setter: (obj: Partial<ScorerConfig>) => void

  constructor (isDefault: boolean, private readonly scene: g.Scene, private readonly config: ScorerConfigSupplier) {
    this.getter = () => isDefault ? config.default() : config.get()
    this.setter = obj => isDefault ? config.defaultIf(obj) : config.setIf(obj)
  }

  font (): g.Font

  font (font: g.Font): ScorerConfigure

  font (args?: g.Font): g.Font | ScorerConfigure {
    if (args) {
      this.setter({ font: args })
      return this
    }
    return this.getter().font
  }

  digit (): number

  digit (digit: number): ScorerConfigure

  digit (args?: number): number | ScorerConfigure {
    if (typeof args === 'number') {
      this.setter({ digit: args })
      return this
    }
    return this.getter().digit
  }

  prefix (): string

  prefix (prefix: string): ScorerConfigure

  prefix (args?: string): string | ScorerConfigure {
    if (args) {
      this.setter({ prefix: args })
      return this
    }
    return this.getter().prefix
  }

  suffix (): string

  suffix (suffix: string): ScorerConfigure

  suffix (args?: string): string | ScorerConfigure {
    if (args) {
      this.setter({ suffix: args })
      return this
    }
    return this.getter().suffix
  }

  refrainsSendingScore (): boolean

  refrainsSendingScore (refrains: boolean): ScorerConfigure

  refrainsSendingScore (args?: boolean): boolean | ScorerConfigure {
    if (arguments.length > 0) {
      this.setter({ refrainsSendingScore: args })
      return this
    }
    return this.getter().refrainsSendingScore
  }

  vars (): unknown

  vars (vars: unknown): ScorerConfigure

  vars (args?: unknown): unknown | ScorerConfigure {
    if (arguments.length > 0) {
      this.setter({ vars: args })
      return this
    }
    return this.getter().vars
  }

  /**
   * 指定された設定で {@link Scorer} を作成します.
   */
  build (): Scorer {
    const config = this.config.get()
    return new ScorerImpl({ scene: this.scene, font: this.font(), digit: config.digit, prefix: config.prefix, suffix: config.suffix, refrainsSendingScore: config.refrainsSendingScore, vars: config.vars })
  }
}
