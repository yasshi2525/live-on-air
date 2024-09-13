import { CommentDeployerConfig, CommentDeployerConfigSupplier } from '../value/commentDeployerConfig'
import { CommentDeployer, CommentDeployerImpl } from '../model/commentDeployer'

/**
 * {@link CommentDeployer} を新規生成する際の各種設定を保持します.
 */
export interface CommentDeployerConfigure {
  /**
   * 作成する CommentDeployer に設定するコメントの移動速度を取得します.
   */
  speed (): number

  /**
   * 作成する CommentDeployer に設定するコメントの移動速度を設定します.
   *
   * @param speed 移動速度
   */
  speed (speed: number): CommentDeployerConfigure

  /**
   * 作成する CommentDeployer に設定するコメント間隔(y座標値)を取得します.
   */
  intervalY (): number

  /**
   * 作成する CommentDeployer に設定するコメント間隔(y座標値)を設定します.
   *
   * @param intervalY コメント間隔(y座標値)
   */
  intervalY (intervalY: number): CommentDeployerConfigure

  /**
   * 作成する CommentDeployer に設定するコメントのフォントを取得します.
   */
  font(): g.Font

  /**
   * 作成する CommentDeployer に設定するコメントのフォントを設定します.
   *
   * @param font コメントのフォント
   */
  font(font: g.Font): CommentDeployerConfigure

  /**
   * CommentDeployer を作成します.
   */
  build(): CommentDeployer
}

export class CommentDeployerConfigureImpl implements CommentDeployerConfigure {
  private readonly getter: () => CommentDeployerConfig
  private readonly setter: (obj: Partial<CommentDeployerConfig>) => void

  constructor (isDefault: boolean, private readonly scene: g.Scene, private readonly config: CommentDeployerConfigSupplier) {
    this.getter = () => isDefault ? config.default() : config.get()
    this.setter = obj => isDefault ? config.defaultIf(obj) : config.setIf(obj)
  }

  speed (): number
  speed (value: number): CommentDeployerConfigure

  speed (args?: number): number | CommentDeployerConfigure {
    if (typeof args === 'number') {
      this.setter({ speed: args })
      return this
    }
    return this.getter().speed
  }

  intervalY (): number
  intervalY (value: number): CommentDeployerConfigure

  intervalY (args?: number): number | CommentDeployerConfigure {
    if (typeof args === 'number') {
      this.setter({ intervalY: args })
      return this
    }
    return this.getter().intervalY
  }

  font (): g.Font
  font (value: g.Font): CommentDeployerConfigure

  font (args?: g.Font): g.Font | CommentDeployerConfigure {
    if (args) {
      this.setter({ font: args })
      return this
    }
    return this.getter().font
  }

  build (): CommentDeployer {
    const config = this.config.get()
    return new CommentDeployerImpl({ scene: this.scene, speed: config.speed, intervalY: config.intervalY, font: config.font })
  }
}
