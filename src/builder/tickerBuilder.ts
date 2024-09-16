import { TickerConfigure, TickerConfigureImpl } from './tickerConfigure'
import { TickerConfigSupplier } from '../value/tickerConfig'

/**
 * 残り時間制御器 {@link Ticker} を簡便に作るためのクラス.
 *
 * Ticker は本クラスを用いて作成してください.
 */
export class TickerBuilder extends TickerConfigureImpl {
  private static lastUsedScene?: g.Scene
  private static defaultConfig?: TickerConfigSupplier
  private static defaultConfigure?: TickerConfigure

  constructor (scene: g.Scene) {
    super(false, scene, new TickerConfigSupplier(TickerBuilder.getDefaultConfig(scene).get()))
  }

  /**
   * 作成する Ticker に設定する残り時間の初期値 (フレーム数) を取得します.
   */
  override frame (): number

  /**
   * 作成する Ticker に設定する残り時間の初期値 (フレーム数) を設定します.
   *
   * @param frame 残り時間の初期値 (フレーム数)
   */
  override frame (frame: number): TickerBuilder

  override frame (args?: number): number | TickerConfigure {
    if (typeof args === 'number') {
      super.frame(args)
      return this
    }
    return super.frame()
  }

  /**
   * 作成する Ticker に設定するフォントを取得します.
   */
  override font (): g.Font

  /**
   * 作成する Ticker に設定するフォントを設定します.
   *
   * @param font 描画に使用するフォント
   */
  override font (font: g.Font): TickerBuilder

  override font (args?: g.Font): g.Font | TickerBuilder {
    if (args) {
      super.font(args)
      return this
    }
    return super.font()
  }

  /**
   * 作成する Ticker に設定する得点の桁数を取得します.
   */
  override digit (): number

  /**
   * 作成する Ticker に設定する得点の桁数を設定します.
   *
   * @param digit 残り時間の桁数
   */
  override digit (digit: number): TickerBuilder

  override digit (args?: number): number | TickerBuilder {
    if (typeof args === 'number') {
      super.digit(args)
      return this
    }
    return super.digit()
  }

  /**
   * 作成する Ticker に設定する前置テキストを取得します.
   */
  override prefix (): string

  /**
   * 作成する Ticker に設定する前置テキストを設定します.
   *
   * @param prefix 前置テキスト
   */
  override prefix (prefix: string): TickerBuilder

  override prefix (args?: string): string | TickerBuilder {
    if (args) {
      super.prefix(args)
      return this
    }
    return super.prefix()
  }

  /**
   * 作成する Ticker に設定する後置テキストを取得します.
   */
  override suffix (): string

  /**
   * 作成する Ticker に設定する後置テキストを設定します.
   *
   * @param suffix 後置テキスト
   */
  override suffix (suffix: string): TickerBuilder

  override suffix (args?: string): string | TickerBuilder {
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
  static getDefault (scene: g.Scene): TickerConfigure {
    if (TickerBuilder.lastUsedScene !== scene) {
      TickerBuilder.resetDefault()
    }
    if (!TickerBuilder.defaultConfigure) {
      TickerBuilder.defaultConfigure = new TickerConfigureImpl(true, scene, TickerBuilder.getDefaultConfig(scene))
    }
    TickerBuilder.lastUsedScene = scene
    return TickerBuilder.defaultConfigure
  }

  private static getDefaultConfig (scene: g.Scene): TickerConfigSupplier {
    if (TickerBuilder.lastUsedScene !== scene) {
      TickerBuilder.resetDefault()
    }
    if (!TickerBuilder.defaultConfig) {
      TickerBuilder.defaultConfig = new TickerConfigSupplier({
        frame: 1800,
        font: new g.DynamicFont({ game: scene.game, fontFamily: 'monospace', size: 40, strokeColor: 'white', strokeWidth: 4 }),
        digit: 2,
        prefix: '残り',
        suffix: '秒'
      })
    }
    TickerBuilder.lastUsedScene = scene
    return TickerBuilder.defaultConfig
  }

  /**
   * {@link getDefault} で設定した変更を消去します.
   * @internal
   */
  private static resetDefault () {
    delete TickerBuilder.defaultConfig
    delete TickerBuilder.defaultConfigure
  }
}
