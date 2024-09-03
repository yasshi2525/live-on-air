import { PlayerConfigComplement, SceneConfigure, SceneConfigureImpl, SpotConfigComplement } from './sceneConfigure'
import { LayerConfig } from './layerConfig'
import { ScenePlayerConfig, SceneSpotConfig } from './sceneConfig'
import { image } from '../util/loader'
import { Scene, SceneImpl } from '../model/scene'
import { DefaultSceneConfigureImpl } from './sceneDefaultConfigure'

/**
 * ゲームが動作する g.Scene を簡便に作るためのクラス.
 */
export class SceneBuilder implements SceneConfigure {
  private static _default?: DefaultSceneConfigureImpl
  private readonly custom: SceneConfigureImpl

  constructor (private readonly game: g.Game) {
    const defaultConfig = SceneBuilder.getDefault(game)
    this.custom = new SceneConfigureImpl({ player: defaultConfig, spot: defaultConfig })
  }

  layer (config: Partial<LayerConfig>): SceneBuilder

  layer (): Readonly<LayerConfig>

  layer (args?: Partial<LayerConfig>): SceneBuilder | Readonly<LayerConfig> {
    if (args) {
      this.custom.layer(args)
      return this
    }
    try {
      return { ...this.custom.layer() }
    } catch (e) {
      if (e instanceof Error && e.message === '領域が設定されていません.') {
        return { ...SceneBuilder.getDefault(this.game).layer() }
      }
      // 非到達想定
      // istanbul ignore next
      throw e
    }
  }

  field (config: object): SceneBuilder

  field (): Readonly<object>

  field (args?: object): SceneBuilder | Readonly<object> {
    if (args) {
      this.custom.field(args)
      return this
    }
    try {
      return { ...this.custom.field() }
    } catch (e) {
      if (e instanceof Error && e.message === '値が設定されていません.') {
        return { ...SceneBuilder.getDefault(this.game).field() }
      }
      // 非到達想定
      // istanbul ignore next
      throw e
    }
  }

  player (config: Partial<ScenePlayerConfig>): SceneBuilder

  player (): Readonly<ScenePlayerConfig>

  player (args?: Partial<ScenePlayerConfig>): SceneBuilder | Readonly<ScenePlayerConfig> {
    if (args) {
      this.custom.player(args)
      return this
    }
    return this.custom.player()
  }

  spot (config: Partial<SceneSpotConfig>): SceneBuilder

  spot (): readonly SceneSpotConfig[]

  spot (args?: Partial<SceneSpotConfig>): SceneBuilder | readonly SceneSpotConfig[] {
    if (args) {
      this.custom.spot(args)
      return this
    }
    return this.custom.spot()
  }

  /**
   * 指定された設定で {@link Scene} を作成します.
   */
  build (): Scene & g.Scene {
    return new SceneImpl({ game: this.game, layer: this.layer(), player: this.player(), spots: this.spot() })
  }

  /**
   * 各属性値に値を設定しなかった際に使用されるデフォルト値を設定します.
   *
   * @param game g.game を指定してください.
   */
  static getDefault (game: g.Game): SceneConfigure & PlayerConfigComplement & SpotConfigComplement {
    if (!SceneBuilder._default) {
      SceneBuilder._default = new DefaultSceneConfigureImpl({
        layer: {
          field: {
            x: 100,
            y: 100,
            width: game.width - 200,
            height: game.height - 200
          }
        },
        player: {
          x: 0,
          y: 0,
          speed: 1,
          asset: image(game.scene()!, 'image/player.default.png')
        },
        spot: {
          x: 0,
          y: 0,
          locked: image(game.scene()!, 'image/spot.default.locked.png'),
          unvisited: image(game.scene()!, 'image/spot.default.unvisited.png'),
          disabled: image(game.scene()!, 'image/spot.default.disabled.png'),
          normal: image(game.scene()!, 'image/spot.default.normal.png')
        }
      })
    }
    return SceneBuilder._default
  }

  /**
   * getDefault() で設定した変更を消去します.
   */
  static resetDefault () {
    delete SceneBuilder._default
  }
}
