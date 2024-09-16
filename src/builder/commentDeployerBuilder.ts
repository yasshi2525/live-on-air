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
   * 作成する CommentDeployer に設定するコメントの移動速度を取得します.
   */
  override speed (): number

  /**
   * 作成する CommentDeployer に設定するコメントの移動速度を設定します.
   *
   * @param speed 移動速度
   */
  override speed (speed: number): CommentDeployerBuilder

  override speed (args?: number): number | CommentDeployerBuilder {
    if (typeof args === 'number') {
      super.speed(args)
      return this
    }
    return super.speed()
  }

  /**
   * 作成する CommentDeployer に設定するコメント間隔(y座標値)を取得します.
   */
  override intervalY (): number

  /**
   * 作成する CommentDeployer に設定するコメント間隔(y座標値)を設定します.
   *
   * @param intervalY コメント間隔(y座標値)
   */
  override intervalY (intervalY: number): CommentDeployerBuilder

  override intervalY (args?: number): number | CommentDeployerBuilder {
    if (typeof args === 'number') {
      super.intervalY(args)
      return this
    }
    return super.intervalY()
  }

  /**
   * 作成する CommentDeployer に設定するコメントのフォントを取得します.
   */
  override font (): g.Font

  /**
   * 作成する CommentDeployer に設定するコメントのフォントを設定します.
   *
   * @param font コメントのフォント
   */
  override font (font: g.Font): CommentDeployerBuilder

  override font (args?: g.Font): g.Font | CommentDeployerBuilder {
    if (args) {
      super.font(args)
      return this
    }
    return super.font()
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
        speed: 1, intervalY: 40, font: new g.DynamicFont({ game: scene.game, fontFamily: 'sans-serif', size: 35, strokeColor: 'white', strokeWidth: 4 })
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
