import { Layer } from './layer'
import { Field } from './field'
import { Broadcaster } from './broadcaster'
import { Screen } from './screen'
import { Spot } from './spot'
import { LayerBuilder } from '../builder/layerBuilder'
import { FieldBuilder } from '../builder/fieldBuilder'
import { BroadcasterBuilder } from '../builder/broadcasterBuilder'
import { SpotBuilder } from '../builder/spotBuilder'
import { LayerConfig } from '../value/layerConfig'
import { BroadcasterConfig } from '../value/broadcasterConfig'
import { SpotConfig } from '../value/spotConfig'
import { ScreenBuilder } from '../builder/screenBuilder'
import { CommentSupplier } from './commentSupplier'
import { CommentDeployer } from './commentDeployer'
import { CommentSupplierBuilder } from '../builder/commentSupplierBuilder'
import { CommentSupplierConfig } from '../value/commentSupplierConfig'
import { CommentDeployerConfig } from '../value/commentDeployerConfig'
import { CommentDeployerBuilder } from '../builder/commentDeployerBuilder'
import { CommentContextSupplier } from './commentContextSupplier'

/**
 * 本ゲームが動作する g.Scene が持つゲーム情報を格納したパラメタ一覧です.
 */
export interface LiveOnAirScene {
  /**
   * レイアウト情報.
   */
  readonly layer: Layer
  /**
   * マップ情報.
   */
  readonly field: Field
  /**
   * 放送者（プレイヤー）情報.
   */
  readonly broadcaster: Broadcaster
  /**
   * 生放送環境情報.
   */
  readonly screen: Screen
  /**
   * スポット情報一覧.
   */
  readonly spots: Spot[]
  /**
   * コメント生成器
   */
  readonly commentSupplier: CommentSupplier
  /**
   * コメント配置器
   */
  readonly commentDeployer: CommentDeployer
}

export class LiveOnAirSceneImpl extends g.Scene implements LiveOnAirScene {
  private context: { loaded: false } | { loaded: true, layer: Layer, field: Field, broadcaster: Broadcaster, screen: Screen, spots: Set<Spot>, commentSupplier: CommentSupplier, commentDeployer: CommentDeployer }

  constructor (param: g.SceneParameterObject & { layer: LayerConfig, broadcaster: BroadcasterConfig, spots: readonly SpotConfig[], commentSupplier: CommentSupplierConfig, commentDeployer: CommentDeployerConfig }) {
    super(param)
    this.context = { loaded: false }
    this.onLoad.add(() => {
      const layer = new LayerBuilder(this)
        .field(param.layer.field)
        .screen(param.layer.screen)
        .comment(param.layer.comment)
        .build()
      const field = new FieldBuilder()
        .build()
      field.container = layer.field
      const broadcaster = new BroadcasterBuilder(this)
        .location({ x: param.broadcaster.x, y: param.broadcaster.y })
        .speed(param.broadcaster.speed)
        .asset(param.broadcaster.asset)
        .build()
      broadcaster.standOn(field)
      const screen = new ScreenBuilder(this)
        .build()
      screen.container = layer.screen
      const spots = new Set<Spot>()
      for (const spot of param.spots) {
        const inst = new SpotBuilder(this)
          .location({ x: spot.x, y: spot.y })
          .image(spot)
          .liveClass(spot.liveClass)
          .build()
        inst.deployOn(field)
        inst.attach(screen)
        spots.add(inst)
      }
      const commentSupplier = new CommentSupplierBuilder(this)
        .interval(param.commentSupplier.interval)
        .comments(param.commentSupplier.comments)
        .build()
      const commentDeployer = new CommentDeployerBuilder(this)
        .speed(param.commentDeployer.speed)
        .intervalY(param.commentDeployer.intervalY)
        .font(param.commentDeployer.font)
        .build()
      commentDeployer.container = layer.comment
      const commentContextSupplier = new CommentContextSupplier({ broadcaster, field, screen })
      commentSupplier.addDeployer(commentDeployer)
      commentSupplier.start(commentContextSupplier)
      this.context = { loaded: true, layer, field, broadcaster, screen, spots, commentSupplier, commentDeployer }
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

  get broadcaster (): Broadcaster {
    if (!this.context.loaded) {
      throw new Error('onLoad が実行されていません. onLoad が実行されてから本パラメタを取得してください')
    }
    return this.context.broadcaster
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

  get commentSupplier (): CommentSupplier {
    if (!this.context.loaded) {
      throw new Error('onLoad が実行されていません. onLoad が実行されてから本パラメタを取得してください')
    }
    return this.context.commentSupplier
  }

  get commentDeployer (): CommentDeployer {
    if (!this.context.loaded) {
      throw new Error('onLoad が実行されていません. onLoad が実行されてから本パラメタを取得してください')
    }
    return this.context.commentDeployer
  }
}
