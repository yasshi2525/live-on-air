/**
 * {@link Scorer} の状態.
 *
 * 'enabled': 得点の変更を許可します.
 *
 * 'disabled': 得点を変更しようとしても無視します.
 */
export type ScorerStatus = 'enabled' | 'disabled'

/**
 * プレイヤーの得点を制御、描画します.
 */
export interface Scorer {
  /**
   * 描画に使用するフォントを取得します.
   */
  readonly font: g.Font

  /**
   * 表示する得点の桁数を取得します.
   */
  readonly digit: number

  /**
   * 得点に前置するテキストを取得します
   */
  readonly prefix: string

  /**
   * 得点に後置するテキストを取得します
   */
  readonly suffix: string

  /**
   * 得点を取得します. (0点以上、小数点以下切り捨て)
   */
  readonly score: number

  /**
   * 得点を取得します. (負の値あり、小数点以下あり)
   */
  readonly rawScore: number

  /**
   * 得点の変更を受け付けるか状態を取得します
   */
  readonly status: ScorerStatus

  /**
   * 得点を描画するエンティティ. (このエンティティの子に得点ラベルが登録されます.)
   */
  container?: g.E

  /**
   * 加点します.
   *
   * @param score 加点する値
   */
  add (score: number): void

  /**
   * 引数の値に得点を設定します.
   *
   * @param score 設定する値
   */
  set (score: number): void

  /**
   * 得点を設定できるようにします.
   */
  enable (): void

  /**
   * 得点を設定しようとしても無視します.
   */
  disable (): void
}

export interface ScorerOptions {
  scene: g.Scene
  font: g.Font
  digit: number
  prefix: string
  suffix: string
}

export class ScorerImpl implements Scorer {
  private readonly scene: g.Scene
  private _container?: g.E
  private readonly _font: g.Font
  private readonly _digit: number
  private readonly _prefix: string
  private readonly _suffix: string
  private readonly _view: g.Label
  private _score: number
  private _status: ScorerStatus = 'disabled'
  constructor ({ scene, font, digit, prefix, suffix }: ScorerOptions) {
    this.scene = scene
    this._font = font
    this._digit = digit
    this._prefix = prefix
    this._suffix = suffix
    if (!scene.game.vars) {
      scene.game.vars = { gameState: { score: 0 } }
    }
    if (!('gameState' in scene.game.vars)) {
      scene.game.vars.gameState = { score: 0 }
    }
    if (!('score' in scene.game.vars.gameState)) {
      scene.game.vars.gameState.score = 0
    }
    this._score = scene.game.vars.gameState.score
    this._view = new g.Label({
      scene,
      font,
      text: this.format(),
      textAlign: 'right',
      widthAutoAdjust: false,
      anchorY: 0.5
    })
  }

  add (score: number): void {
    if (this._status === 'enabled') {
      this._score += score
      this.scene.game.vars.gameState.score = this.score
      this._view.text = this.format()
      this._view.invalidate()
    }
  }

  set (score: number): void {
    if (this._status === 'enabled') {
      this._score = score
      this.scene.game.vars.gameState.score = this.score
      this._view.text = this.format()
      this._view.invalidate()
    }
  }

  enable (): void {
    this._status = 'enabled'
  }

  disable () {
    this._status = 'disabled'
  }

  get status (): ScorerStatus {
    return this._status
  }

  get container (): g.E | undefined {
    return this._container
  }

  set container (container: g.E | undefined) {
    if (container) {
      container.append(this._view)
      this._view.width = container.width
      this._view.y = container.height / 2
      this._view.modified()
    } else {
      this._view.remove()
    }
    this._container = container
  }

  get font (): g.Font {
    return this._font
  }

  get digit (): number {
    return this._digit
  }

  get prefix (): string {
    return this._prefix
  }

  get suffix (): string {
    return this._suffix
  }

  get score (): number {
    return Math.max(Math.floor(this._score), 0)
  }

  get rawScore (): number {
    return this._score
  }

  private format (): string {
    return `${this.prefix}${this.score.toString().padStart(this._digit)}${this.suffix}`
  }
}
