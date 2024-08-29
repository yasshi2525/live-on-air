import { Field } from './field'
import { Spot } from './spot'
/**
 * プレイヤーの状態を表します.
 *
 * "non-field": マップ上に配置されていない.
 *
 * "staying": ある Spot に滞在中である.
 *
 * "moving": ある Spot に向かって移動中である.
 *
 * "stopping": マップ上で待機中である.
 */
export type PlayerStatus = 'non-field' | 'staying' | 'moving' | 'stopping'

/**
 * プレイヤー.
 *
 * プレイヤーはマップの上 (Field) を移動でき、 Spot を訪問すると生放送します.
 */
export interface Player {
  /**
   * 移動速度. 1フレームで移動する距離 (画面座標系) で指定します
   */
  speed: number
  /**
   * プレイヤーの座標
   *
   * マップ field 上にいないときは undefined が返されます
   */
  readonly location?: Readonly<g.CommonOffset>

  /**
   * プレイヤーが所属するマップ.
   *
   * マップ上にいないときは undefined が返されます
   */
  readonly field?: Field

  /**
   * プレイヤーが現在訪問中の Spot.
   *
   * 訪問中出ない場合 undefined を返します.
   */
  readonly staying?: Spot

  /**
   * プレイヤーが現在向かっている Spot.
   *
   * 目的地がない場合、 undefined を返します
   */
  readonly destination?: Spot

  /**
   * プレイヤーの現在の状態を取得します.
   */
  readonly status: PlayerStatus

  /**
   * 指定したマップに登録し、マップの上を移動できるようにします.
   *
   * 本メソッドを実行するとプレイヤーが画面上に描画されるようになります.
   *
   * @param field 登録先マップ
   */
  standOn(field: Field): void

  /**
   * 指定した Spot の場所にワープします.
   *
   * 移動速度 speed の制約は受けず、移動は瞬間で完了します.
   * プレイヤーはマップ field を登録している必要があります
   * @see standOn
   *
   * @param spot ワープ先
   */
  jumpTo(spot: Spot): void

  /**
   * 指定した Spot へ移動し始めます.
   *
   * 移動は 1フレームあたり speed の距離進みます.
   * プレイヤーはマップ field を登録している必要があります
   * @see standOn
   *
   * @param spot
   */
  departTo(spot: Spot): void

  /**
   * 移動中の場合、移動を中止します.
   *
   * 現在地で待機を開始します.
   * プレイヤーはマップ field を登録している必要があります
   * @see standOn
   */
  stop(): void
}

export class PlayerImpl implements Player {
  private _field?: Field
  private _location?: g.CommonOffset
  private _staying?: Spot
  private _destination?: Spot
  private _status: PlayerStatus = 'non-field'

  // eslint-disable-next-line no-useless-constructor
  constructor (protected _speed: number) { }

  standOn (field: Field): void {
    if (this._field && this._field !== field) {
      throw new Error('このplayerはすでに異なるfieldに配置されているので、指定のfieldに配置できません.' +
        ' playerはただ一人である必要があり、fieldには複数のplayerを配置できません')
    }

    this._field = field
    this._location = { x: 0, y: 0 }
    this._status = 'stopping'

    if (!field.player) {
      field.addPlayer(this)
    }
  }

  jumpTo (spot: Spot): void {
    if (!spot.field || !spot.location) {
      throw new Error('指定したspotがfieldに配置されていないためワープに失敗しました. spotをfieldに配置してください')
    }
    if (!this._field || !this._location) {
      throw new Error('playerがfieldに配置されていないためワープに失敗しました. playerをfieldに配置してください')
    }
    if (this._field !== spot.field) {
      throw new Error('指定したspotがplayerと異なるfieldに配置されているためワープに失敗しました. 同じfieldに配置されたspotを指定してください')
    }
    if (this._destination) {
      throw new Error('playerは現在移動中のためワープに失敗しました. playerの移動を停止してください')
    }

    this._location.x = spot.location.x
    this._location.y = spot.location.y

    this._staying = spot
    this._status = 'staying'
  }

  departTo (spot: Spot): void {
    if (!spot.field) {
      throw new Error('指定したspotがfieldに配置されていないため移動先の設定に失敗しました. spotをfieldに配置してください')
    }
    if (!this._field) {
      throw new Error('playerがfieldに配置されていないため移動先の設定に失敗しました. playerをfieldに配置してください')
    }
    if (this._field !== spot.field) {
      throw new Error('指定したspotがplayerと異なるfieldに配置されているため移動先の設定に失敗しました. 同じfieldに配置されたspotを指定してください')
    }
    if (this._destination) {
      throw new Error('playerは現在移動中のため移動先の設定に失敗しました. playerの移動を停止してください')
    }

    this._field.disableSpotExcept(spot)

    this._staying = undefined
    this._destination = spot
    this._status = 'moving'

    if (spot.status !== 'target') {
      spot.setAsDestination()
    }
  }

  stop (): void {
    if (!this._field) {
      throw new Error('playerがfieldに配置されていないため移動の停止に失敗しました. playerをfieldに配置してください')
    }
    if (!this._destination) {
      throw new Error('playerは現在移動中でないため移動の停止に失敗しました. playerの移動中に停止命令を実行してください')
    }

    const oldDestination = this._destination
    this._field.enableSpotExcept(oldDestination)
    this._destination = undefined
    this._status = 'stopping'

    if (oldDestination.status === 'target') {
      oldDestination.unsetAsDestination()
    }
  }

  get speed (): number {
    return this._speed
  }

  set speed (value: number) {
    if (value <= 0) {
      throw new Error(`無効な値 "${value}" を移動速度に設定しようとしました. 0より大きな正の値を指定してください`)
    }
    this._speed = value
  }

  get location (): Readonly<g.CommonOffset> | undefined {
    if (this._location) {
      return { ...this._location }
    }
    return undefined
  }

  get field (): Field | undefined {
    return this._field
  }

  get destination (): Spot | undefined {
    return this._destination
  }

  get staying (): Spot | undefined {
    return this._staying
  }

  get status (): PlayerStatus {
    return this._status
  }
}
