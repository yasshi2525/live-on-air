import { ObjectSupplier, PrimitiveValueSupplier, ValueSupplier, ValueValidator } from './value'

/**
 * {@link Broadcaster} 生成時に利用する設定値
 */
export interface BroadcasterConfig {
  /**
   * 作成する Broadcaster に設定する移動速度
   */
  speed: number
  /**
   * 作成する Broadcaster に設定するx座標
   */
  x: number
  /**
   * 作成する Broadcaster に設定するy座標
   */
  y: number
  /**
   * 作成する Broadcaster に使用される画像アセット
   */
  asset: g.ImageAsset
}

/**
 * {@link Broadcaster} 生成に必要な属性値を設定します.
 */
export class BroadcasterConfigSupplier implements ValueSupplier<BroadcasterConfig> {
  private readonly speed: PrimitiveValueSupplier<number>
  private readonly location: ObjectSupplier<g.CommonOffset>
  private readonly asset: PrimitiveValueSupplier<g.ImageAsset>

  constructor (initial: BroadcasterConfig) {
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

  setIf (obj: Partial<BroadcasterConfig>): void {
    this.speed.setIf(obj.speed)
    this.location.setIf(obj)
    this.asset.setIf(obj.asset)
  }

  get (): BroadcasterConfig {
    return {
      speed: this.speed.get(),
      ...this.location.get(),
      asset: this.asset.get()
    }
  }

  default (): BroadcasterConfig {
    return {
      speed: this.speed.default(),
      ...this.location.default(),
      asset: this.asset.default()
    }
  }

  defaultIf (obj: Partial<BroadcasterConfig>): void {
    this.speed.defaultIf(obj.speed)
    this.location.defaultIf(obj)
    this.asset.defaultIf(obj.asset)
  }
}
