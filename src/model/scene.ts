import { Layer } from './layer'
import { Field } from './field'
import { Player } from './player'
import { Screen } from './screen'
import { Spot } from './spot'
import { LayerBuilder } from '../builder/layerBuilder'
import { FieldBuilder } from '../builder/fieldBuilder'
import { PlayerBuilder } from '../builder/playerBuilder'
import { SpotBuilder } from '../builder/spotBuilder'
import { LayerConfig } from '../value/layerConfig'
import { PlayerConfig } from '../value/playerConfig'
import { SpotConfig } from '../value/spotConfig'
import { ScreenBuilder } from '../builder/screenBuilder'

/**
 * 本ゲームが動作する g.Scene が持つゲーム情報を格納したパラメタ一覧です.
 */
export interface Scene{
  /**
   * レイアウト情報.
   */
  readonly layer: Layer
  /**
   * マップ情報.
   */
  readonly field: Field
  /**
   * プレイヤー情報.
   */
  readonly player: Player
  /**
   * 生放送環境情報.
   */
  readonly screen: Screen
  /**
   * スポット情報一覧.
   */
  readonly spots: Spot[]
}

export class SceneImpl extends g.Scene implements Scene {
  private context: { loaded: false } | { loaded: true, layer: Layer, field: Field, player: Player, screen: Screen, spots: Set<Spot> }

  constructor (param: g.SceneParameterObject & { layer: LayerConfig, player: PlayerConfig, spots: readonly SpotConfig[] }) {
    super(param)
    this.context = { loaded: false }
    this.onLoad.add(() => {
      const layer = new LayerBuilder(this)
        .field(param.layer.field)
        .screen(param.layer.screen)
        .build()
      const field = new FieldBuilder()
        .build()
      field.view = layer.field
      const player = new PlayerBuilder(this)
        .location({ x: param.player.x, y: param.player.y })
        .speed(param.player.speed)
        .asset(param.player.asset)
        .build()
      player.standOn(field)
      const screen = new ScreenBuilder(this)
        .build()
      screen.view = layer.screen
      const spots = new Set<Spot>()
      for (const spot of param.spots) {
        const inst = new SpotBuilder(this)
          .location({ x: spot.x, y: spot.y })
          .image(spot)
          .build()
        inst.deployOn(field)
        inst.attach(screen)
        spots.add(inst)
      }
      this.context = { loaded: true, layer, field, player, screen, spots }
    })
  }

  get layer (): Layer {
    if (!this.context.loaded) {
      throw new Error('onLoad が実行されていません. onLoad が実行されてから本パラメタを取得してください')
    }
    return this.context.layer
  }

  get field (): Field {
    if (!this.context.loaded) {
      throw new Error('onLoad が実行されていません. onLoad が実行されてから本パラメタを取得してください')
    }
    return this.context.field
  }

  get player (): Player {
    if (!this.context.loaded) {
      throw new Error('onLoad が実行されていません. onLoad が実行されてから本パラメタを取得してください')
    }
    return this.context.player
  }

  get screen (): Screen {
    if (!this.context.loaded) {
      throw new Error('onLoad が実行されていません. onLoad が実行されてから本パラメタを取得してください')
    }
    return this.context.screen
  }

  get spots (): Spot[] {
    if (!this.context.loaded) {
      throw new Error('onLoad が実行されていません. onLoad が実行されてから本パラメタを取得してください')
    }
    return [...this.context.spots]
  }
}
