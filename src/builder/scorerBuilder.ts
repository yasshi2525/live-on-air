import { ScorerConfigure, ScorerConfigureImpl } from './scorerConfigure'
import { ScorerConfigSupplier } from '../value/scorerConfig'

/**
 * 得点制御器 {@link Scorer} を簡便に作るためのクラス.
 *
 * Scorer は本クラスを用いて作成してください.
 */
export class ScorerBuilder extends ScorerConfigureImpl {
  private static lastUsedScene?: g.Scene
  private static defaultConfig?: ScorerConfigSupplier
  private static defaultConfigure?: ScorerConfigure

  constructor (scene: g.Scene) {
    super(false, scene, new ScorerConfigSupplier(ScorerBuilder.getDefaultConfig(scene).get()))
  }

  /**
   * 作成する Scorer に設定するフォントを取得します.
   */
  override font (): g.Font

  /**
   * 作成する Scorer に設定するフォントを設定します.
   *
   * @param font 描画に使用するフォント
   */
  override font (font: g.Font): ScorerBuilder

  override font (args?: g.Font): g.Font | ScorerBuilder {
    if (args) {
      super.font(args)
      return this
    }
    return super.font()
  }

  /**
   * 作成する Scorer に設定する得点の桁数を取得します.
   */
  override digit (): number

  /**
   * 作成する Scorer に設定する得点の桁数を設定します.
   *
   * @param digit 得点の桁数
   */
  override digit (digit: number): ScorerBuilder

  override digit (args?: number): number | ScorerBuilder {
    if (typeof args === 'number') {
      super.digit(args)
      return this
    }
    return super.digit()
  }

  /**
   * 作成する Scorer に設定する前置テキストを取得します.
   */
  override prefix (): string

  /**
   * 作成する Scorer に設定する前置テキストを設定します.
   *
   * @param prefix 前置テキスト
   */
  override prefix (prefix: string): ScorerBuilder

  override prefix (args?: string): string | ScorerBuilder {
    if (args) {
      super.prefix(args)
      return this
    }
    return super.prefix()
  }

  /**
   * 作成する Scorer に設定する後置テキストを取得します.
   */
  override suffix (): string

  /**
   * 作成する Scorer に設定する後置テキストを設定します.
   *
   * @param suffix 後置テキスト
   */
  override suffix (suffix: string): ScorerBuilder

  override suffix (args?: string): string | ScorerBuilder {
    if (args) {
      super.suffix(args)
      return this
    }
    return super.suffix()
  }

  /**
   * 得点をサーバーに送信するかどうか取得します.
   */
  override refrainsSendingScore (): boolean

  /**
   * 得点をサーバーに送信するのを控えるかどうか設定します.
   * @param refrains 送信しない場合 true
   */
  override refrainsSendingScore (refrains: boolean): ScorerBuilder

  override refrainsSendingScore (args?: boolean): boolean | ScorerBuilder {
    if (args !== undefined) {
      super.refrainsSendingScore(args)
      return this
    }
    return super.refrainsSendingScore()
  }

  /**
   * 作成する ScorerBuilder のライブラリ利用者が自由に使えるフィールドを取得します.
   */
  override vars (): unknown

  /**
   * 作成する ScorerBuilder のライブラリ利用者が自由に使えるフィールドを設定します.
   *
   * @param vars ライブラリ利用者が自由に使えるフィールド
   */
  override vars (vars: unknown): ScorerBuilder

  override vars (args?: unknown): unknown | ScorerBuilder {
    if (arguments.length > 0) {
      super.vars(args)
      return this
    }
    return super.vars()
  }

  /**
   * 各属性値に値を設定しなかった際に使用されるデフォルト値を設定します.
   *
   * @param scene 現在の scene を指定してください.
   */
  static getDefault (scene: g.Scene): ScorerConfigure {
    if (ScorerBuilder.lastUsedScene !== scene) {
      ScorerBuilder.resetDefault()
    }
    if (!ScorerBuilder.defaultConfigure) {
      ScorerBuilder.defaultConfigure = new ScorerConfigureImpl(true, scene, ScorerBuilder.getDefaultConfig(scene))
    }
    ScorerBuilder.lastUsedScene = scene
    return ScorerBuilder.defaultConfigure
  }

  private static getDefaultConfig (scene: g.Scene): ScorerConfigSupplier {
    if (ScorerBuilder.lastUsedScene !== scene) {
      ScorerBuilder.resetDefault()
    }
    if (!ScorerBuilder.defaultConfig) {
      ScorerBuilder.defaultConfig = new ScorerConfigSupplier({
        font: new g.DynamicFont({ game: scene.game, fontFamily: 'monospace', size: 40, strokeColor: 'white', strokeWidth: 4 }),
        digit: 4,
        prefix: 'スコア',
        suffix: '点',
        refrainsSendingScore: false,
        vars: undefined
      })
    }
    ScorerBuilder.lastUsedScene = scene
    return ScorerBuilder.defaultConfig
  }

  /**
   * {@link getDefault} で設定した変更を消去します.
   * @internal
   */
  private static resetDefault () {
    delete ScorerBuilder.defaultConfig
    delete ScorerBuilder.defaultConfigure
  }
}
