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
  font (): g.Font

  /**
   * 作成する Scorer に設定するフォントを設定します.
   *
   * @param font 描画に使用するフォント
   */
  font (font: g.Font): ScorerBuilder

  font (args?: g.Font): g.Font | ScorerBuilder {
    if (args) {
      super.font(args)
      return this
    }
    return super.font()
  }

  /**
   * 作成する Scorer に設定する得点の桁数を取得します.
   */
  digit (): number

  /**
   * 作成する Scorer に設定する得点の桁数を設定します.
   *
   * @param digit 得点の桁数
   */
  digit (digit: number): ScorerBuilder

  digit (args?: number): number | ScorerBuilder {
    if (typeof args === 'number') {
      super.digit(args)
      return this
    }
    return super.digit()
  }

  /**
   * 作成する Scorer に設定する前置テキストを取得します.
   */
  prefix (): string

  /**
   * 作成する Scorer に設定する前置テキストを設定します.
   *
   * @param prefix 前置テキスト
   */
  prefix (prefix: string): ScorerBuilder

  prefix (args?: string): string | ScorerBuilder {
    if (args) {
      super.prefix(args)
      return this
    }
    return super.prefix()
  }

  /**
   * 作成する Scorer に設定する後置テキストを取得します.
   */
  suffix (): string

  /**
   * 作成する Scorer に設定する後置テキストを設定します.
   *
   * @param suffix 後置テキスト
   */
  suffix (suffix: string): ScorerBuilder

  suffix (args?: string): string | ScorerBuilder {
    if (args) {
      super.suffix(args)
      return this
    }
    return super.suffix()
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
        font: new g.DynamicFont({ game: scene.game, fontFamily: 'sans-serif', size: 40 }),
        digit: 4,
        prefix: 'スコア',
        suffix: '点'
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
