import { PrimitiveValueSupplier, ValueSupplier, ValueValidator } from './value'

/**
 * {@link CommentDeployer} 生成時に利用する設定値
 */
export interface CommentDeployerConfig {
  /**
   * 作成する CommentDeployer に設定する、コメントが画面上を流れる速度.
   *
   * 1フレームあたりの移動座標値
   */
  speed: number
  /**
   * 作成する CommentDeployer に設定する、コメントの表示間隔 (y座標値)
   */
  intervalY: number
  /**
   * 作成する CommentDeployer に設定する、コメントのフォント
   */
  font: g.Font
}

/**
 * {@link CommentDeployer} 生成に必要な属性値を設定します.
 */
export class CommentDeployerConfigSupplier implements ValueSupplier<CommentDeployerConfig> {
  private readonly speed: PrimitiveValueSupplier<number>
  private readonly intervalY: PrimitiveValueSupplier<number>
  private readonly font: PrimitiveValueSupplier<g.Font>

  constructor (initial: CommentDeployerConfig) {
    this.speed = PrimitiveValueSupplier.create(initial.speed, new class extends ValueValidator<number> {
      override isInvalid (value: number): boolean {
        return value <= 0
      }

      override getMessage (value: number): string {
        return super.getMessage(value) + ' コメントの移動速度は0より大きな正の値ではなければなりません.'
      }
    }())
    this.intervalY = PrimitiveValueSupplier.create(initial.intervalY, new class extends ValueValidator<number> {
      override isInvalid (value: number): boolean {
        return value <= 0
      }

      override getMessage (value: number): string {
        return super.getMessage(value) + ' コメントの表示間隔(y座標値)は0より大きな正の値ではなければなりません.'
      }
    }())
    this.font = PrimitiveValueSupplier.create(initial.font)
  }

  setIf (obj: Partial<CommentDeployerConfig>): void {
    this.speed.setIf(obj.speed)
    this.intervalY.setIf(obj.intervalY)
    this.font.setIf(obj.font)
  }

  get (): CommentDeployerConfig {
    return {
      speed: this.speed.get(),
      intervalY: this.intervalY.get(),
      font: this.font.get()
    }
  }

  defaultIf (obj: Partial<CommentDeployerConfig>): void {
    this.speed.defaultIf(obj.speed)
    this.intervalY.defaultIf(obj.intervalY)
    this.font.defaultIf(obj.font)
  }

  default (): CommentDeployerConfig {
    return {
      speed: this.speed.default(),
      intervalY: this.intervalY.default(),
      font: this.font.default()
    }
  }
}
