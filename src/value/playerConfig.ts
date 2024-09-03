import { ObjectSupplier, PrimitiveValueSupplier, ValueSupplier, ValueValidator } from './value'

/**
 * {@link Player} 生成時に利用する設定値
 */
export interface PlayerConfig {
  /**
   * 作成する Player に設定する移動速度
   */
  speed: number
  /**
   * 作成する Player に設定するx座標
   */
  x: number
  /**
   * 作成する Player に設定するy座標
   */
  y: number
  /**
   * 作成する Player に使用される画像アセット
   */
  asset: g.ImageAsset
}

/**
 * {@link Player} 生成に必要な属性値を設定します.
 */
export class PlayerConfigSupplier implements ValueSupplier<PlayerConfig> {
  private readonly speed: PrimitiveValueSupplier<number>
  private readonly location: ObjectSupplier<g.CommonOffset>
  private readonly asset: PrimitiveValueSupplier<g.ImageAsset>

  constructor (initial: PlayerConfig) {
    this.speed = PrimitiveValueSupplier.create(initial.speed, new class extends ValueValidator<number> {
      override isInvalid (value: number): boolean {
        return value <= 0
      }

      override getMessage (value: number): string {
        return super.getMessage(value) + ' 移動速度は0より大きな正の値でなければなりません.'
      }
    }())
    this.location = ObjectSupplier.create({ x: initial.x, y: initial.y })
    this.asset = PrimitiveValueSupplier.create(initial.asset)
  }

  setIf (obj: Partial<PlayerConfig>): void {
    this.speed.setIf(obj.speed)
    this.location.setIf(obj)
    this.asset.setIf(obj.asset)
  }

  get (): PlayerConfig {
    return {
      speed: this.speed.get(),
      ...this.location.get(),
      asset: this.asset.get()
    }
  }

  default (): PlayerConfig {
    return {
      speed: this.speed.default(),
      ...this.location.default(),
      asset: this.asset.default()
    }
  }

  defaultIf (obj: Partial<PlayerConfig>): void {
    this.speed.defaultIf(obj.speed)
    this.location.defaultIf(obj)
    this.asset.defaultIf(obj.asset)
  }
}
