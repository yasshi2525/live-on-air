import { LayerConfigure, LayerConfigureImpl } from './layerConfigure'
import { LayerConfigSupplier } from '../value/layerConfig'

/**
 * レイアウト情報をもとに g.Scene に配置する各エンティティ ({@link Layer}) の構築を支援します.
 *
 * Layer は本クラスを用いて作成してください.
 */
export class LayerBuilder extends LayerConfigureImpl {
  private static lastUsedScene?: g.Scene
  private static defaultConfig?: LayerConfigSupplier
  private static defaultConfigure?: LayerConfigure

  constructor (scene: g.Scene) {
    super(false, scene, new LayerConfigSupplier(LayerBuilder.getDefaultConfig(scene).get()))
  }

  /**
   * Spot, Broadcaster が配置されるマップの大きさを取得します.
   */
  override field (): Readonly<g.CommonArea>

  /**
   * Spot, Broadcaster が配置されるマップの大きさを設定します.
   *
   * @param area 設定する領域
   */
  override field (area: g.CommonArea): LayerBuilder

  override field (args?: g.CommonArea): LayerBuilder | Readonly<g.CommonArea> {
    if (args) {
      super.field(args)
      return this
    }
    return super.field()
  }

  /**
   * Live が配置される生放送画面の大きさを取得します.
   */
  override screen (): Readonly<g.CommonArea>

  /**
   * Live が配置される生放送画面の大きさを設定します.
   *
   * @param area 設定する領域
   */
  override screen (area: g.CommonArea): LayerBuilder

  override screen (args?: g.CommonArea): LayerBuilder | Readonly<g.CommonArea> {
    if (args) {
      super.screen(args)
      return this
    }
    return super.screen()
  }

  /**
   * コメントが表示される領域の大きさを取得します.
   */
  override comment (): Readonly<g.CommonArea>

  /**
   * コメントが表示される領域の大きさを設定します.
   *
   * @param area 設定する領域
   */
  override comment (area: g.CommonArea): LayerBuilder

  override comment (args?: g.CommonArea): LayerBuilder | Readonly<g.CommonArea> {
    if (args) {
      super.comment(args)
      return this
    }
    return super.comment()
  }

  /**
   * 残り時間と得点が表示される領域の大きさを取得します.
   */
  override header (): Readonly<g.CommonArea>

  /**
   * 残り時間と得点が表示される領域の大きさを設定します.
   *
   * @param area 設定する領域
   */
  override header (area: g.CommonArea): LayerBuilder

  override header (args?: g.CommonArea): LayerBuilder | Readonly<g.CommonArea> {
    if (args) {
      super.header(args)
      return this
    }
    return super.header()
  }

  /**
   * ライブラリ利用者が自由に使えるフィールドを取得します.
   */
  override vars (): unknown

  /**
   * ライブラリ利用者が自由に使えるフィールドを設定します.
   *
   * @param vars ライブラリ利用者が自由に使えるフィールド
   */
  override vars (vars: unknown): LayerBuilder

  override vars (args?: unknown): unknown | LayerBuilder {
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
  static getDefault (scene: g.Scene): LayerConfigure {
    if (LayerBuilder.lastUsedScene !== scene) {
      LayerBuilder.resetDefault()
    }
    if (!LayerBuilder.defaultConfigure) {
      LayerBuilder.defaultConfigure = new LayerConfigureImpl(true, scene, LayerBuilder.getDefaultConfig(scene))
    }
    LayerBuilder.lastUsedScene = scene
    return LayerBuilder.defaultConfigure
  }

  private static getDefaultConfig (scene: g.Scene): LayerConfigSupplier {
    if (LayerBuilder.lastUsedScene !== scene) {
      LayerBuilder.resetDefault()
    }
    if (!LayerBuilder.defaultConfig) {
      LayerBuilder.defaultConfig = new LayerConfigSupplier({
        field: { x: 100, y: 100, width: scene.game.width - 200, height: scene.game.height - 200 },
        screen: { x: 100, y: 100, width: scene.game.width - 200, height: scene.game.height - 200 },
        comment: { x: 100, y: 100, width: scene.game.width - 200, height: scene.game.height - 200 },
        header: { x: 0, y: 0, width: scene.game.width, height: 100 },
        vars: undefined
      })
    }
    LayerBuilder.lastUsedScene = scene
    return LayerBuilder.defaultConfig
  }

  /**
   * {@link getDefault} で設定した変更を消去します.
   *
   * @internal
   */
  private static resetDefault () {
    delete LayerBuilder.defaultConfig
    delete LayerBuilder.defaultConfigure
  }
}
