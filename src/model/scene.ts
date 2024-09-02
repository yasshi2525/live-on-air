import { Layer } from './layer'
import { Field } from './field'
import { Player } from './player'
import { Spot } from './spot'
import { LayerBuilder } from '../builder/layerBuilder'
import { LayerConfig } from '../builder/layerConfig'
import { FieldBuilder } from '../builder/fieldBuilder'
import { PlayerBuilder } from '../builder/playerBuilder'
import { ScenePlayerConfig, SceneSpotConfig } from '../builder/sceneConfig'
import { SpotBuilder } from '../builder/spotBuilder'

export interface Scene extends g.Scene {
  readonly layer: Layer
  readonly field: Field
  readonly player: Player
  readonly spots: Spot[]
}

export class SceneImpl extends g.Scene implements Scene {
  private context: { loaded: false } | { loaded: true, layer: Layer, field: Field, player: Player, spots: Set<Spot> }

  constructor (param: g.SceneParameterObject & { layer: LayerConfig, player: ScenePlayerConfig, spots: readonly SceneSpotConfig[] }) {
    super(param)
    this.context = { loaded: false }
    this.onLoad.add(() => {
      const layer = new LayerBuilder(this)
        .field(param.layer.field)
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
      const spots = new Set<Spot>()
      for (const spot of param.spots) {
        const inst = new SpotBuilder(this)
          .location({ x: spot.x, y: spot.y })
          .image(spot)
          .build()
        inst.deployOn(field)
        spots.add(inst)
      }
      this.context = { loaded: true, layer, field, player, spots }
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

  get spots (): Spot[] {
    if (!this.context.loaded) {
      throw new Error('onLoad が実行されていません. onLoad が実行されてから本パラメタを取得してください')
    }
    return [...this.context.spots]
  }
}
