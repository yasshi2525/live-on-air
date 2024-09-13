import { CommentSchema, CommentSupplier, CommentSupplierImpl } from '../model/commentSupplier'
import { CommentDeployerConfig, CommentDeployerConfigSupplier } from '../value/commentDeployerConfig'
import { CommentSupplierConfig, CommentSupplierConfigSupplier } from '../value/commentSupplierConfig'
import { CommentContext } from '../model/commentContext'

/**
 * {@link CommentSupplier} を新規作成する際の各種設定を保持します.
 */
export interface CommentSupplierConfigure {
    /**
     * 作成する CommentSupplier に設定するコメント生成間隔(ミリ秒)を取得します.
     */
    interval(): number

    /**
     * 作成する CommentSupplier に設定するコメント生成間隔(ミリ秒)を設定します.
     *
     * @param interval コメントの生成間隔(ミリ秒)
     */
    interval(interval: number): CommentSupplierConfigure

    /**
     * 出力するコメントを登録します.
     *
     * @param comment コメント本文
     * @param conditions コメントを出力する条件(複数指定可). 省略した場合、状況にかかわらず出力します.
     */
    add(comment: string, ...conditions: ((ctx: CommentContext) => boolean)[]): CommentSupplierConfigure

    /**
     * CommentSupplier を作成します.
     */
    build(): CommentSupplier
}

export class CommentSupplierConfigureImpl implements CommentSupplierConfigure {
  private readonly getter: () => CommentSupplierConfig
  private readonly setter: (obj: Partial<CommentSupplierConfig>) => void
  private readonly payload: CommentSchema[] = []

  constructor (isDefault: boolean, private readonly scene: g.Scene, private readonly config: CommentSupplierConfigSupplier) {
    this.getter = () => isDefault ? config.default() : config.get()
    this.setter = obj => isDefault ? config.defaultIf(obj) : config.setIf(obj)
  }

  interval(): number
  interval(value: number): CommentSupplierConfigure

  interval (args?: number): number | CommentSupplierConfigure {
    if (typeof args === 'number') {
      this.setter({ interval: args })
      return this
    }
    return this.getter().interval
  }

  add (comment: string, ...conditions: ((ctx: CommentContext) => boolean)[]): CommentSupplierConfigure {
    this.payload.push({
      comment,
      conditions: [...conditions]
    })
    return this
  }

  build (): CommentSupplier {
    const config = this.config.get()
    return new CommentSupplierImpl({
      scene: this.scene,
      interval: config.interval,
      fps: this.scene.game.fps,
      payload: this.payload
    })
  }
}
