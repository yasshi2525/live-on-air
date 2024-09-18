import { FieldConfigure, FieldConfigureImpl } from './fieldConfigure'
import { FieldConfigSupplier } from '../value/fieldConfig'

/**
 * マップ ({@link Field}) を簡便に作るためのクラス.
 *
 * Field は本クラスを用いて作成してください.
 */
export class FieldBuilder extends FieldConfigureImpl {
  private static lastUsedScene?: g.Scene
  private static defaultConfig?: FieldConfigSupplier
  private static defaultConfigure?: FieldConfigure

  constructor (scene: g.Scene) {
    super(false, new FieldConfigSupplier(FieldBuilder.getDefaultConfig(scene).get()))
  }

  /**
   * 作成する Field のライブラリ利用者が自由に使えるフィールドを取得します.
   */
  override vars (): unknown

  /**
   * 作成する Field のライブラリ利用者が自由に使えるフィールドを設定します.
   *
   * @param vars ライブラリ利用者が自由に使えるフィールド
   */
  override vars (vars: unknown): FieldBuilder

  override vars (args?: unknown): unknown | FieldBuilder {
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
  static getDefault (scene: g.Scene): FieldConfigure {
    if (FieldBuilder.lastUsedScene !== scene) {
      FieldBuilder.resetDefault()
    }
    if (!FieldBuilder.defaultConfigure) {
      FieldBuilder.defaultConfigure = new FieldConfigureImpl(true, FieldBuilder.getDefaultConfig(scene))
    }
    FieldBuilder.lastUsedScene = scene
    return FieldBuilder.defaultConfigure
  }

  private static getDefaultConfig (scene: g.Scene): FieldConfigSupplier {
    if (FieldBuilder.lastUsedScene !== scene) {
      FieldBuilder.resetDefault()
    }
    if (!FieldBuilder.defaultConfig) {
      FieldBuilder.defaultConfig = new FieldConfigSupplier({ vars: undefined })
    }
    FieldBuilder.lastUsedScene = scene
    return FieldBuilder.defaultConfig
  }

  /**
   * {@link getDefault} で設定した変更を消去します.
   * @internal
   */
  private static resetDefault () {
    delete FieldBuilder.defaultConfig
    delete FieldBuilder.defaultConfigure
  }
}
