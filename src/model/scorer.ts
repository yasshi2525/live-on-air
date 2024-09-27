import { NumberLabel, NumberLabelImpl, NumberLabelOptions } from './numberLabel'

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
export interface Scorer extends NumberLabel {
  /**
   * 得点を取得します. (0点以上、小数点以下切り捨て)
   */
  readonly value: number

  /**
   * 得点を取得します. (負の値あり、小数点以下あり)
   */
  readonly rawValue: number

  /**
   * 得点の変更を受け付けるか状態を取得します
   */
  readonly status: ScorerStatus

  /**
   * 得点を記録しても、サーバーには送信しない設定か取得します.
   */
  readonly refrainsSendingScore: boolean

  /**
   * ライブラリ利用者が自由に使えるフィールドです.
   */
  vars?: unknown

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

  /**
   * 得点をサーバーに常時送るようにします.
   *
   * サーバーへの送信を抑止（refrainsSendingScore）している場合、
   * 本メソッドを呼び出して抑止を解除する必要があります.
   */
  keepSendingScore (): void
}

export type ScorerOptions = Omit<NumberLabelOptions, 'value' | 'textAlign'> & { refrainsSendingScore: boolean, vars: unknown }

export class ScorerImpl extends NumberLabelImpl implements Scorer {
  vars?: unknown
  private game: g.Game
  private _refrainsSendingScore: boolean

  constructor ({ scene, font, digit, prefix, suffix, refrainsSendingScore, vars }: ScorerOptions) {
    if (!scene.game.vars) {
      scene.game.vars = { gameState: { score: 0 } }
    }
    if (!('gameState' in scene.game.vars)) {
      scene.game.vars.gameState = { score: 0 }
    }
    if (!('score' in scene.game.vars.gameState)) {
      scene.game.vars.gameState.score = 0
    }
    super({ scene, value: scene.game.vars.gameState.score as number, font, digit, prefix, suffix, textAlign: 'right' })
    this.game = scene.game
    this._refrainsSendingScore = refrainsSendingScore
    this.vars = vars
    this.onValue.add(() => {
      if (!this._refrainsSendingScore) {
        this.game.vars.gameState.score = this.value
      }
    })
  }

  keepSendingScore () {
    this._refrainsSendingScore = false
    this.game.vars.gameState.score = this.value
  }

  override get value (): number {
    return Math.max(Math.floor(super.value), 0)
  }

  get rawValue (): number {
    return super.value
  }

  get refrainsSendingScore (): boolean {
    return this._refrainsSendingScore
  }
}
