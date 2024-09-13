import { CommentDeployerConfigSupplier } from '../value/commentDeployerConfig'
import { CommentDeployerConfigure, CommentDeployerConfigureImpl } from './commentDeployerConfigure'

/**
 * 画面上に流れるコメントを配置する {@link CommentDeployer} を簡便に作るためのクラス.
 *
 * CommentDeployer は本クラスを用いて作成してください.
 */
export class CommentDeployerBuilder extends CommentDeployerConfigureImpl {
  private static lastUsedScene?: g.Scene
  private static defaultConfig?: CommentDeployerConfigSupplier
  private static defaultConfigure?: CommentDeployerConfigure

  constructor (scene: g.Scene) {
    super(false, scene, new CommentDeployerConfigSupplier(CommentDeployerBuilder.getDefaultConfig(scene).get()))
  }

  /**
   * 各属性値に値を設定しなかった際に使用されるデフォルト値を設定します.
   *
   * @param scene 現在の scene を指定してください.
   */
  static getDefault (scene: g.Scene): CommentDeployerConfigure {
    if (CommentDeployerBuilder.lastUsedScene !== scene) {
      CommentDeployerBuilder.resetDefault()
    }
    if (!CommentDeployerBuilder.defaultConfigure) {
      CommentDeployerBuilder.defaultConfigure = new CommentDeployerConfigureImpl(true, scene, CommentDeployerBuilder.getDefaultConfig(scene))
    }
    CommentDeployerBuilder.lastUsedScene = scene
    return CommentDeployerBuilder.defaultConfigure
  }

  private static getDefaultConfig (scene: g.Scene): CommentDeployerConfigSupplier {
    if (CommentDeployerBuilder.lastUsedScene !== scene) {
      CommentDeployerBuilder.resetDefault()
    }
    if (!CommentDeployerBuilder.defaultConfig) {
      CommentDeployerBuilder.defaultConfig = new CommentDeployerConfigSupplier({
        speed: 1, intervalY: 40, font: new g.DynamicFont({ game: scene.game, fontFamily: 'sans-serif', size: 35 })
      })
    }
    CommentDeployerBuilder.lastUsedScene = scene
    return CommentDeployerBuilder.defaultConfig
  }

  /**
   * {@link getDefault} で設定した変更を消去します.
   * @internal
   */
  private static resetDefault () {
    delete CommentDeployerBuilder.defaultConfig
    delete CommentDeployerBuilder.defaultConfigure
  }
}
