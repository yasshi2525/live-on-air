import { CommentSchema, CommentSupplier, CommentSupplierImpl } from '../model/commentSupplier'
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
     * 出力するコメントを追加します.
     *
     * @param comment コメント本文
     * @param conditions コメントを出力する条件(複数指定可). 省略した場合、状況にかかわらず出力します.
     */
    addComment(comment: string, ...conditions: ((ctx: CommentContext) => boolean)[]): CommentSupplierConfigure

    /**
     * 登録されたコメント設定を取得します
     */
    comments(): CommentSchema[]

  /**
   * 出力するコメントを設定します.
   *
   * これまで設定した情報は削除されます.
   *
   * @param comments コメント情報
   */
    comments(comments: CommentSchema[]): CommentSupplierConfigure

}

export class CommentSupplierConfigureImpl implements CommentSupplierConfigure {
  private readonly getter: () => CommentSupplierConfig
  private readonly setter: (obj: Partial<CommentSupplierConfig>) => void
  private readonly commentAdder: (obj: CommentSchema) => void

  constructor (isDefault: boolean, private readonly scene: g.Scene, private readonly config: CommentSupplierConfigSupplier) {
    this.getter = () => isDefault ? config.default() : config.get()
    this.setter = obj => isDefault ? config.defaultIf(obj) : config.setIf(obj)
    this.commentAdder = obj => isDefault ? config.addDefaultComment(obj) : config.addComment(obj)
  }

  interval (): number
  interval (value: number): CommentSupplierConfigure

  interval (args?: number): number | CommentSupplierConfigure {
    if (typeof args === 'number') {
      this.setter({ interval: args })
      return this
    }
    return this.getter().interval
  }

  addComment (comment: string, ...conditions: ((ctx: CommentContext) => boolean)[]): CommentSupplierConfigure {
    this.commentAdder({ comment, conditions })
    return this
  }

  comments (): CommentSchema[]
  comments (value: CommentSchema[]): CommentSupplierConfigure

  comments (args?: CommentSchema[]): CommentSchema[] | CommentSupplierConfigure {
    if (args) {
      this.setter({ comments: args })
      return this
    }
    return this.getter().comments
  }

  /**
   * CommentSupplier を作成します.
   */
  build (): CommentSupplier {
    const config = this.config.get()
    return new CommentSupplierImpl({
      scene: this.scene,
      interval: config.interval,
      fps: this.scene.game.fps,
      comments: config.comments
    })
  }
}
