import { ObjectSupplier, OptionalValueSupplier, PrimitiveValueSupplier, ValueSupplier, ValueValidator } from './value'

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
  /**
   * ライブラリ利用者が自由に使えるフィールドです
   */
  vars: unknown
}

/**
 * {@link Broadcaster} 生成に必要な属性値を設定します.
 */
export class BroadcasterConfigSupplier implements ValueSupplier<BroadcasterConfig> {
  private readonly speed: PrimitiveValueSupplier<number>
  private readonly location: ObjectSupplier<g.CommonOffset>
  private readonly asset: PrimitiveValueSupplier<g.ImageAsset>
  private readonly vars: OptionalValueSupplier<unknown>

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
    this.vars = OptionalValueSupplier.create(initial.vars)
  }

  setIf (obj: Partial<BroadcasterConfig>): void {
    this.speed.setIf(obj.speed)
    this.location.setIf(obj)
    this.asset.setIf(obj.asset)
    this.vars.setIf(obj.vars)
  }

  get (): BroadcasterConfig {
    return {
      speed: this.speed.get(),
      ...this.location.get(),
      asset: this.asset.get(),
      vars: this.vars.get()
    }
  }

  default (): BroadcasterConfig {
    return {
      speed: this.speed.default(),
      ...this.location.default(),
      asset: this.asset.default(),
      vars: this.vars.default()
    }
  }

  defaultIf (obj: Partial<BroadcasterConfig>): void {
    this.speed.defaultIf(obj.speed)
    this.location.defaultIf(obj)
    this.asset.defaultIf(obj.asset)
    this.vars.defaultIf(obj.vars)
  }
}
