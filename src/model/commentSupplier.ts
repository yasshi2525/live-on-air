import { CommentContext } from './commentContext'
import { PrimitiveValueSupplier, ValueValidator } from '../value/value'
import { CommentDeployer } from './commentDeployer'
import { CommentContextSupplier } from './commentContextSupplier'

/**
 * {@link CommentSupplier} の状態.
 *
 * 'initialized': 初期設定が終わり、コメント生成開始可能な状態.
 *
 * 'scheduled': 時間経過にあわせてコメント生成中
 */
export type CommentSupplierStatus = 'initialized' | 'scheduled'

/**
 * コメントが描画される条件を定義します.
 */
export type CommentCondition = (ctx: CommentContext) => boolean

/**
 * コメント本文と描画条件を格納します.
 */
export interface CommentSchema {
  /**
   * コメント本文
   */
  comment: string,
  /**
   * コメント描画条件. すべての条件をみたす際に描画されます.
   */
  conditions: CommentCondition[]
}

/**
 * 画面上に表示されるコメントを生成します.
 *
 * {@link CommentSupplierBuilder} を使ってインスタンスを作成してください.
 */
export interface CommentSupplier {
  /**
   * コメントが生成された際に発火するトリガ
   */
  readonly onSupply: g.Trigger<string>

  /**
   * コメントの生成間隔 (ミリ秒).
   */
  interval: number

  /**
   * 登録された全コメント.
   */
  readonly comments: readonly CommentSchema[]

  /**
   * 現在の状態
   */
  readonly status: CommentSupplierStatus

  /**
   * 生成されたコメントを画面上に配置する CommentDeployer 一覧
   */
  readonly deployers: readonly CommentDeployer[]

  /**
   * ライブラリ利用者が自由に使えるフィールドです.
   */
  vars?: unknown

  /**
   * 生成されたコメントを画面上に配置する CommentDeployer を登録します.
   *
   * @param deployer 生成されたコメントを画面上に配置する CommentDeployer
   */
  addDeployer (deployer: CommentDeployer): void

  /**
   * コメントを時間経過にあわせて生成するようにします.
   *
   * @param contextSupplier {@link CommentContext} を作成するインスタンス
   */
  start(contextSupplier: CommentContextSupplier): void

  /**
   * 現在の tick におけるコメントを生成します.
   * ライブラリ利用者は本メソッドを呼び出す必要はありません. 自動的に呼び出されます.
   *
   * @param context コメント生成条件の判定に使用する環境情報
   * @internal
   */
  fetch(context: CommentContext): string[]
}

export interface CommentSupplierOptions {
  scene: g.Scene
  interval: number
  fps: number
  comments: CommentSchema[]
  vars: unknown
}

export class CommentSupplierImpl implements CommentSupplier {
  readonly onSupply = new g.Trigger<string>()
  vars?: unknown
  private readonly scene: g.Scene
  private readonly _deployers = new Set<CommentDeployer>()
  private _interval: PrimitiveValueSupplier<number>
  private readonly _fps: number
  private readonly _comments: CommentSchema[]
  private indexCount = 0
  private intervalCount = 0
  private _status: CommentSupplierStatus = 'initialized'

  constructor ({ scene, interval, fps, comments, vars }: CommentSupplierOptions) {
    this.scene = scene
    if (comments.length === 0) {
      throw new Error('コメント候補が登録されていません. 1つ以上のエントリを登録してください.')
    }
    this._comments = [...comments]
    this._interval = PrimitiveValueSupplier.create(interval, new class extends ValueValidator<number> {
      override isInvalid (value: number): boolean {
        return value <= 0
      }

      override getMessage (value: number): string {
        return super.getMessage(value) + ' コメント生成間隔は0より大きな正の値でなければなりません.'
      }
    }())
    this._fps = fps
    this.vars = vars
  }

  fetch (context: CommentContext): string[] {
    const result: string[] = []
    while (this.intervalCount > 0) {
      const tailIndex = this.prevIndex
      let matched = false
      while (!(matched = this.match(context)) && !this.loops(tailIndex)) {
        this.next()
      }
      if (matched) {
        result.push(this.comment)
        for (const dest of this._deployers) {
          dest.deploy(this.comment)
        }
        this.onSupply.fire(this.comment)
        this.next()
      }
      this.intervalCount -= this._interval.get()
    }
    this.intervalCount += 1000 / this._fps
    return result
  }

  addDeployer (deployer: CommentDeployer) {
    if (!this._deployers.has(deployer)) {
      this._deployers.add(deployer)
    }
    if (!deployer.suppliers.some(s => s === this)) {
      deployer.subscribe(this)
    }
  }

  start (contextSupplier: CommentContextSupplier) {
    if (this._status === 'scheduled') {
      throw new Error('すでに時間経過にあわせてコメント生成中のため、startに失敗しました. startできるのは1回だけです')
    }

    this.scene.onUpdate.add(() => {
      this.fetch(contextSupplier.get())
    })

    this._status = 'scheduled'
  }

  get interval (): number {
    return this._interval.get()
  }

  set interval (value: number) {
    this._interval.setIf(value)
  }

  get status () {
    return this._status
  }

  get deployers (): readonly CommentDeployer[] {
    return [...this._deployers]
  }

  get comments (): readonly CommentSchema[] {
    return [...this._comments]
  }

  private next (): CommentSchema {
    this.indexCount++
    return this.schema
  }

  private match (context: CommentContext): boolean {
    return this.schema.conditions.reduce((prev, current) => !prev ? false : current(context), true)
  }

  private loops (index: number): boolean {
    return this.index === index % this._comments.length
  }

  private get index (): number {
    return this.indexCount % this._comments.length
  }

  private get prevIndex () : number {
    const index = this.index
    if (index === 0) {
      return this._comments.length - 1
    }
    return index - 1
  }

  private get schema (): CommentSchema {
    return this._comments[this.index]
  }

  private get comment (): string {
    return this.schema.comment
  }
}
