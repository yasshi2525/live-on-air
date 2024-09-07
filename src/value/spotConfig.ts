import { ObjectSupplier, PrimitiveValueSupplier, RecordSupplier, ValueSupplier } from './value'
import { Live } from '../model/live'

/**
 * {@link Spot} の状態一覧
 */
export const spotAssetTypes = ['locked', 'unvisited', 'disabled', 'normal'] as const

/**
 * {@link Spot} の状態一覧
 */
export type SpotAssetType = typeof spotAssetTypes[number]

/**
 * {@link Spot} の各状態における表示画像アセット一覧
 */
export type SpotAssetRecord = Record<SpotAssetType, g.ImageAsset>

/**
 * {@link Spot} 生成時に利用する設定値
 */
export interface SpotConfig {
  /**
   * 作成する Spot に設定するx座標
   */
  x: number
  /**
   * 作成する Spot に設定するy座標
   */
  y: number
  /**
   * 未解放状態の画像アセット.
   *
   * 放送者（プレイヤー）には存在を見せたいが、条件をみたすまで
   * 訪問させたくない Spot を作成したいときに設定してください.
   */
  locked: g.ImageAsset
  /**
   * 未訪問状態の画像アセット.
   *
   * 放送者（プレイヤー）がまだ訪問していない場合、
   * 強調表示をして訪問を促したい際に設定してください.
   */
  unvisited: g.ImageAsset
  /**
   * 訪問操作受付禁止状態の画像アセット.
   *
   * 放送者（プレイヤー）が他の Spot に向かって移動しているときなど、
   * クリックしても目的地に指定できないことを強調する際に設定してください.
   */
  disabled: g.ImageAsset
  /**
   * 通常時の画像アセット.
   *
   * 放送者（プレイヤー）がクリックすれば目的地に設定される状態の際の画像を設定してください.
   */
  normal: g.ImageAsset
  /**
   * 訪問時に始まる生放送.
   *
   * 生放送での処理を定義したクラス名を設定してください. インスタンスでない点にご留意ください.
   */
  liveClass: new () => Live
}

/**
 * {@link Spot} 生成に必要な属性値を設定します.
 */
export class SpotConfigSupplier implements ValueSupplier<SpotConfig> {
  private readonly location: ObjectSupplier<g.CommonOffset>
  private readonly assets: RecordSupplier<SpotAssetType, g.ImageAsset>
  private readonly liveClass: PrimitiveValueSupplier<new () => Live>

  constructor (initial: SpotConfig) {
    this.location = ObjectSupplier.create({ x: initial.x, y: initial.y })
    this.assets = RecordSupplier.create({
      locked: initial.locked,
      unvisited: initial.unvisited,
      disabled: initial.disabled,
      normal: initial.normal
    })
    this.liveClass = PrimitiveValueSupplier.create(initial.liveClass)
  }

  get (): SpotConfig {
    return {
      ...this.location.get(),
      ...this.assets.get(),
      liveClass: this.liveClass.get()
    }
  }

  setIf (obj: Partial<SpotConfig>): void {
    this.location.setIf(obj)
    this.assets.setIf(obj)
    this.liveClass.setIf(obj.liveClass)
  }

  default (): SpotConfig {
    return {
      ...this.location.default(),
      ...this.assets.default(),
      liveClass: this.liveClass.default()
    }
  }

  defaultIf (obj: Partial<SpotConfig>): void {
    this.location.defaultIf(obj)
    this.assets.defaultIf(obj)
    this.liveClass.defaultIf(obj.liveClass)
  }
}
