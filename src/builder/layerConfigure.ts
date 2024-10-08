import { LayerConfig, LayerConfigSupplier } from '../value/layerConfig'
import { Layer, LayerImpl } from '../model/layer'

/**
 * {@link Layer} を新規作成する際の各種設定を保持します.
 */
export interface LayerConfigure {
  /**
   * Spot, Broadcaster が配置されるマップの大きさを取得します.
   */
  field (): Readonly<g.CommonArea>

  /**
   * Spot, Broadcaster が配置されるマップの大きさを設定します.
   *
   * @param area 設定する領域
   */
  field (area: g.CommonArea): LayerConfigure

  /**
   * Live が配置される生放送画面の大きさを取得します.
   */
  screen (): Readonly<g.CommonArea>

  /**
   * Live が配置される生放送画面の大きさを設定します.
   *
   * @param area 設定する領域
   */
  screen (area: g.CommonArea): LayerConfigure

  /**
   * コメントが表示される領域の大きさを取得します.
   */
  comment (): Readonly<g.CommonArea>

  /**
   * コメントが表示される領域の大きさを設定します.
   *
   * @param area 設定する領域
   */
  comment (area: g.CommonArea): LayerConfigure

  /**
   * 残り時間と得点が表示される領域の大きさを取得します.
   */
  header (): Readonly<g.CommonArea>

  /**
   * 残り時間と得点が表示される領域の大きさを設定します.
   *
   * @param area 設定する領域
   */
  header (area: g.CommonArea): LayerConfigure

  /**
   * ライブラリ利用者が自由に使えるフィールドを取得します.
   */
  vars (): unknown

  /**
   * ライブラリ利用者が自由に使えるフィールドを設定します.
   *
   * @param vars ライブラリ利用者が自由に使えるフィールド
   */
  vars (vars: unknown): LayerConfigure
}

export class LayerConfigureImpl implements LayerConfigure {
  private readonly getter: () => LayerConfig
  private readonly setter: (obj: Partial<LayerConfig>) => void

  constructor (isDefault: boolean, private readonly scene: g.Scene, private readonly config: LayerConfigSupplier) {
    this.getter = () => isDefault ? config.default() : config.get()
    this.setter = obj => isDefault ? config.defaultIf(obj) : config.setIf(obj)
  }

  field (): Readonly<g.CommonArea>

  field (area: g.CommonArea): LayerConfigure

  field (args?: g.CommonArea): LayerConfigure | Readonly<g.CommonArea> {
    if (args) {
      this.setter({ field: { x: args.x, y: args.y, width: args.width, height: args.height } })
      return this
    }
    return this.getter().field
  }

  screen (): Readonly<g.CommonArea>

  screen (area: g.CommonArea): LayerConfigure

  screen (args?: g.CommonArea): LayerConfigure | Readonly<g.CommonArea> {
    if (args) {
      this.setter({ screen: { x: args.x, y: args.y, width: args.width, height: args.height } })
      return this
    }
    return this.getter().screen
  }

  comment (): Readonly<g.CommonArea>

  comment (area: g.CommonArea): LayerConfigure

  comment (args?: g.CommonArea): LayerConfigure | Readonly<g.CommonArea> {
    if (args) {
      this.setter({ comment: { x: args.x, y: args.y, width: args.width, height: args.height } })
      return this
    }
    return this.getter().comment
  }

  header (): Readonly<g.CommonArea>

  header (area: g.CommonArea): LayerConfigure

  header (args?: g.CommonArea): LayerConfigure | Readonly<g.CommonArea> {
    if (args) {
      this.setter({ header: { x: args.x, y: args.y, width: args.width, height: args.height } })
      return this
    }
    return this.getter().header
  }

  vars (): unknown

  vars (vars: unknown): LayerConfigure

  vars (args?: unknown): unknown | LayerConfigure {
    if (arguments.length > 0) {
      this.setter({ vars: args })
      return this
    }
    return this.getter().vars
  }

  /**
   * 設定されたレイアウト情報をもとに各レイヤを作成し、sceneに登録します
   */
  build (): Layer {
    return new LayerImpl(this.scene, this.config.get())
  }
}
