import { Player, PlayerImpl } from '../model/player'

/**
 * プレイヤー Player を簡便に作るためのクラス.
 *
 * Player は本クラスを用いて作成してください.
 */
export class PlayerBuilder {
  private _speed: number

  constructor () {
    this._speed = 1
  }

  /**
   * 作成する player に設定する移動速度を取得します.
   */
  get speed (): number {
    return this._speed
  }

  /**
   * 作成する player に設定する移動速度を設定します.
   *
   * @param value 移動速度
   */
  set speed (value: number) {
    if (value <= 0) {
      throw new Error(`無効な値 "${value}" を移動速度に設定しようとしました. 0より大きな正の値を指定してください`)
    }
    this._speed = value
  }

  /**
   * player を作成します.
   */
  build (): Player {
    return new PlayerImpl(this._speed)
  }
}
