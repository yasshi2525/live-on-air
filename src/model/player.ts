import { Field } from './field'
import { Spot } from './spot'
import { Easing, Timeline, Tween } from '@akashic-extension/akashic-timeline'
/**
 * プレイヤー ({@link Player}) の状態を表します.
 *
 * "non-field": マップ上に配置されていない.
 *
 * "staying": ある {@link Spot} に滞在中である. (生放送はしていない)
 *
 * "moving": ある Spot に向かって移動中である.
 *
 * "stopping": マップ上で待機中である.
 *
 * "on-air": スポットにて生放送中
 */
export type PlayerStatus = 'non-field' | 'staying' | 'moving' | 'stopping' | 'on-air'

/**
 * プレイヤー.
 *
 * プレイヤーはマップの上 ({@link Field}) を移動でき、 {@link Spot} を訪問すると生放送します.
 * {@link PlayerBuilder} を使ってインスタンスを作成してください.
 */
export interface Player {
  /**
   * Spot に到達した際発火されます. 引数には到達した Spot が格納されます.
   */
  readonly onEnter: g.Trigger<Spot>

  /**
   * Spot での生放送が終了した際発火されます.
   */
  readonly onLiveEnd: g.Trigger

  /**
   * 移動速度. 1フレームで移動する距離 (画面座標系) で指定します
   */
  speed: number
  /**
   * プレイヤーの座標
   *
   * マップ (Field) 上にいないときは undefined が返されます
   */
  readonly location?: Readonly<g.CommonOffset>

  /**
   * 現在描画されているプレイヤーのエンティティ.
   */
  readonly view: g.E

  /**
   * プレイヤーが所属するマップ (Field).
   *
   * マップ (Field) 上にいないときは undefined が返されます
   */
  readonly field?: Field

  /**
   * プレイヤーが現在滞在中または生放送をしている Spot.
   *
   * 滞在中でない場合 undefined を返します.
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
   * 指定したマップ (Field) に登録し、マップの上を移動できるようにします.
   *
   * 本メソッドを実行するとプレイヤーが画面上に描画されるようになります.
   *
   * @param field 登録先マップ
   */
  standOn(field: Field): void

  /**
   * 指定した Spot の場所にワープします.
   *
   * 移動速度 {@link speed} の制約は受けず、移動は瞬間で完了します.
   * プレイヤーはマップ (Field) を登録している必要があります.
   * プレイヤーは移動中でない必要があります. 移動中の場合は停止させてください.
   *
   * @see standOn
   * @see stop
   *
   * @param spot ワープ先
   */
  jumpTo(spot: Spot): void

  /**
   * 指定した Spot へ移動し始めます.
   *
   * 移動は 1フレームあたり {@link speed} の距離進みます.
   * プレイヤーはマップ (Field) を登録している必要があります.
   * プレイヤーは移動中でない必要があります. 移動中の場合は停止させてください.
   *
   * @see standOn
   * @see stop
   *
   * @param spot 目的地として設定する Spot
   */
  departTo(spot: Spot): void

  /**
   * 移動中の場合、移動を中止します.
   *
   * 現在地で待機を開始します.
   * プレイヤーはマップ (Field) を登録している必要があります.
   * プレイヤーは移動中でない場合、実行に失敗します.
   *
   * @see standOn
   * @see destination
   */
  stop(): void

  /**
   * 生放送が終わったため、再びマップで移動可能状態にします.
   *
   * 生放送中でない場合、実行に失敗します.
   *
   * 本メソッドは自動で呼び出されるため、
   * 本ライブラリ利用者が実行する必要はありません.
   *
   * @internal
   */
  backFromLive(): void
}

export class PlayerImpl implements Player {
  readonly onEnter = new g.Trigger<Spot>()
  readonly onLiveEnd = new g.Trigger()

  private _field?: Field
  private readonly _view: g.E
  private _staying?: Spot
  private _destination?: Spot
  private _status: PlayerStatus = 'non-field'
  private _tween?: Tween

  constructor (_scene: g.Scene, _asset: g.ImageAsset, private _speed: number, location: g.CommonOffset) {
    this._view = new g.Sprite({ scene: _scene, src: _asset, x: location.x, y: location.y })
  }

  standOn (field: Field): void {
    if (this._field && this._field !== field) {
      throw new Error('このplayerはすでに異なるfieldに配置されているので、指定のfieldに配置できません.' +
        ' playerはただ一人である必要があり、fieldには複数のplayerを配置できません')
    }

    this._field = field
    this._status = 'stopping'

    if (!field.player) {
      field.addPlayer(this)
    }
  }

  jumpTo (spot: Spot): void {
    if (!spot.field || !spot.location) {
      throw new Error('指定したspotがfieldに配置されていないためワープに失敗しました. spotをfieldに配置してください')
    }
    if (!this._field || !this.location) {
      throw new Error('playerがfieldに配置されていないためワープに失敗しました. playerをfieldに配置してください')
    }
    if (this._field !== spot.field) {
      throw new Error('指定したspotがplayerと異なるfieldに配置されているためワープに失敗しました. 同じfieldに配置されたspotを指定してください')
    }
    if (this._destination) {
      throw new Error('playerは現在移動中のためワープに失敗しました. playerの移動を停止してください')
    }
    if (!spot.screen) {
      throw new Error('screenが設定されていないspotに到達したため、生放送の開始に失敗しました. spotにscreenを設定してください')
    }

    this._view.x = spot.location.x
    this._view.y = spot.location.y

    this._destination = spot
    spot.markAsVisited()
    this._destination = undefined
    this._status = 'on-air'
    this._staying = spot

    this._view.hide()
    spot.screen.startLive(this)
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
    if (this._destination || this._tween) {
      throw new Error('playerは現在移動中のため移動先の設定に失敗しました. playerの移動を停止してください')
    }
    if (!spot.screen) {
      throw new Error('screenが設定されていないため移動先の設定に失敗しました. spotにscreenを設定してください')
    }

    this._field.disableSpotExcept(spot)

    this._staying = undefined
    this._destination = spot
    this._tween = new Timeline(this._view.scene).create(this._view)
    const distance = g.Util.distanceBetweenOffsets(spot.location!, this._view)
    if (distance > 0) {
      this._tween.moveTo(spot.location!.x, spot.location!.y, distance / this._speed, Easing.easeInOutCubic)
    }
    this._tween.call(() => {
      spot.markAsVisited()
      this._destination = undefined
      this._tween = undefined
      this._staying = spot
      this._status = 'on-air'
      this._field!.enableSpotExcept(spot)
      spot.unsetAsDestination()
      this.onEnter.fire(spot)
      this._view.hide()
      spot.screen!.startLive(this)
    })
    this._status = 'moving'

    if (spot.status !== 'target') {
      spot.setAsDestination()
    }
  }

  stop (): void {
    if (!this._field) {
      throw new Error('playerがfieldに配置されていないため移動の停止に失敗しました. playerをfieldに配置してください')
    }
    if (!this._destination || !this._tween) {
      throw new Error('playerは現在移動中でないため移動の停止に失敗しました. playerの移動中に停止命令を実行してください')
    }

    const oldDestination = this._destination
    this._field.enableSpotExcept(oldDestination)
    this._destination = undefined
    this._tween.cancel()
    this._tween = undefined
    this._status = 'stopping'

    if (oldDestination.status === 'target') {
      oldDestination.unsetAsDestination()
    }
  }

  backFromLive (): void {
    if (this._status !== 'on-air') {
      throw new Error('生放送中でない状態で生放送終了後処理を実行しようとしました. playerが生放送中であることを確認してください')
    }
    this._view.show()
    this._status = 'staying'
    this.onLiveEnd.fire()
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
    if (this._field) {
      return { x: this._view.x, y: this._view.y }
    }
    return undefined
  }

  get view (): g.E {
    return this._view
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
