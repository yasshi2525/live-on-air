import { CommentSupplierConfigure, CommentSupplierConfigureImpl } from './commentSupplierConfigure'
import { CommentSupplierConfigSupplier } from '../value/commentSupplierConfig'

/**
 * コメント生成器 ({@link CommentSupplier}) を簡便に作るためのクラス.
 *
 * CommentSupplier は本クラスを用いて作成してください.
 */
export class CommentSupplierBuilder extends CommentSupplierConfigureImpl {
  private static lastUsedScene?: g.Scene
  private static defaultConfig?: CommentSupplierConfigSupplier
  private static defaultConfigure?: CommentSupplierConfigure

  constructor (scene: g.Scene) {
    super(false, scene, new CommentSupplierConfigSupplier(CommentSupplierBuilder.getDefaultConfig(scene).get()))
  }

  /**
   * 各属性値に値を設定しなかった際に使用されるデフォルト値を設定します.
   *
   * @param scene 現在の scene を指定してください.
   */
  static getDefault (scene: g.Scene): CommentSupplierConfigure {
    if (CommentSupplierBuilder.lastUsedScene !== scene) {
      CommentSupplierBuilder.resetDefault()
    }
    if (!CommentSupplierBuilder.defaultConfigure) {
      CommentSupplierBuilder.defaultConfigure = new CommentSupplierConfigureImpl(true, scene, CommentSupplierBuilder.getDefaultConfig(scene))
    }
    CommentSupplierBuilder.lastUsedScene = scene
    return CommentSupplierBuilder.defaultConfigure
  }

  private static getDefaultConfig (scene: g.Scene): CommentSupplierConfigSupplier {
    if (CommentSupplierBuilder.lastUsedScene !== scene) {
      CommentSupplierBuilder.resetDefault()
    }
    if (!CommentSupplierBuilder.defaultConfig) {
      CommentSupplierBuilder.defaultConfig = new CommentSupplierConfigSupplier({
        interval: 1000,
        comments: []
      })
    }
    CommentSupplierBuilder.lastUsedScene = scene
    return CommentSupplierBuilder.defaultConfig
  }

  /**
   * {@link getDefault} で設定した変更を消去します.
   * @internal
   */
  private static resetDefault () {
    delete CommentSupplierBuilder.defaultConfig
    delete CommentSupplierBuilder.defaultConfigure
  }
}
