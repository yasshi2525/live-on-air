import { CommentSupplierConfigure, CommentSupplierConfigureImpl } from './commentSupplierConfigure'
import { CommentSupplierConfigSupplier } from '../value/commentSupplierConfig'
import { CommentContext } from '../model/commentContext'
import { CommentSchema } from '../model/commentSupplier'

/**
 * コメント生成器 ({@link CommentSupplier}) を簡便に作るためのクラス.
 *
 * CommentSupplier は本クラスを用いて作成してください.
 */
export class CommentSupplierBuilder extends CommentSupplierConfigureImpl {
  private static lastUsedScene?: g.Scene
  private static defaultConfig?: CommentSupplierConfigSupplier
  private static defaultConfigure?: CommentSupplierConfigure

  constructor (scene: g.Scene) {
    super(false, scene, new CommentSupplierConfigSupplier(CommentSupplierBuilder.getDefaultConfig(scene).get()))
  }

  /**
   * 作成する CommentSupplier に設定するコメント生成間隔(ミリ秒)を取得します.
   */
  interval (): number

  /**
   * 作成する CommentSupplier に設定するコメント生成間隔(ミリ秒)を設定します.
   *
   * @param interval コメントの生成間隔(ミリ秒)
   */
  interval (interval: number): CommentSupplierBuilder

  interval (args?: number): number | CommentSupplierBuilder {
    if (typeof args === 'number') {
      super.interval(args)
      return this
    }
    return super.interval()
  }

  /**
   * 出力するコメントを追加します.
   *
   * @param comment コメント本文
   * @param conditions コメントを出力する条件(複数指定可). 省略した場合、状況にかかわらず出力します.
   */
  addComment (comment: string, ...conditions: ((ctx: CommentContext) => boolean)[]): CommentSupplierBuilder {
    super.addComment(comment, ...conditions)
    return this
  }

  /**
   * 登録されたコメント設定を取得します
   */
  comments (): CommentSchema[]

  /**
   * 出力するコメントを設定します.
   *
   * これまで設定した情報は削除されます.
   *
   * @param comments コメント情報
   */
  comments (comments: CommentSchema[]): CommentSupplierBuilder

  comments (args?: CommentSchema[]): CommentSchema[] | CommentSupplierBuilder {
    if (args) {
      super.comments(args)
      return this
    }
    return super.comments()
  }

  /**
   * 各属性値に値を設定しなかった際に使用されるデフォルト値を設定します.
   *
   * @param scene 現在の scene を指定してください.
   */
  static getDefault (scene: g.Scene): CommentSupplierConfigure {
    if (CommentSupplierBuilder.lastUsedScene !== scene) {
      CommentSupplierBuilder.resetDefault()
    }
    if (!CommentSupplierBuilder.defaultConfigure) {
      CommentSupplierBuilder.defaultConfigure = new CommentSupplierConfigureImpl(true, scene, CommentSupplierBuilder.getDefaultConfig(scene))
    }
    CommentSupplierBuilder.lastUsedScene = scene
    return CommentSupplierBuilder.defaultConfigure
  }

  private static getDefaultConfig (scene: g.Scene): CommentSupplierConfigSupplier {
    if (CommentSupplierBuilder.lastUsedScene !== scene) {
      CommentSupplierBuilder.resetDefault()
    }
    if (!CommentSupplierBuilder.defaultConfig) {
      let isCommented = false
      CommentSupplierBuilder.defaultConfig = new CommentSupplierConfigSupplier({
        interval: 1000,
        comments: [{
          comment: 'わこつ',
          conditions: [() => {
            if (isCommented) {
              return false
            } else {
              isCommented = true
              return true
            }
          }]
        }]
      })
    }
    CommentSupplierBuilder.lastUsedScene = scene
    return CommentSupplierBuilder.defaultConfig
  }

  /**
   * {@link getDefault} で設定した変更を消去します.
   * @internal
   */
  private static resetDefault () {
    delete CommentSupplierBuilder.defaultConfig
    delete CommentSupplierBuilder.defaultConfigure
  }
}
