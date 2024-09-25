import { Field } from './field'
import { Spot } from './spot'
import { Easing, Timeline, Tween } from '@akashic-extension/akashic-timeline'
import { Live } from './live'
/**
 * 放送者（プレイヤー） ({@link Broadcaster}) の状態を表します.
 *
 * "non-field": マップ上に配置されていない.
 *
 * "staying": ある {@link Spot} に滞在中である. (生放送はしていない)
 *
 * "moving": ある Spot に向かって移動中である.
 *
 * "stopping-on-ground": マップ上で待機中である.
 *
 * "on-air": スポットにて生放送中
 */
export type BroadcasterStatus = 'non-field' | 'staying-in-spot' | 'moving' | 'stopping-on-ground' | 'on-air'

/**
 * 放送者（プレイヤー）.
 *
 * 放送者（プレイヤー）はマップの上 ({@link Field}) を移動でき、 {@link Spot} を訪問すると生放送します.
 * {@link BroadcasterBuilder} を使ってインスタンスを作成してください.
 */
export interface Broadcaster {
  /**
   * Spot に到達した際発火されます. 引数には到達した Spot が格納されます.
   */
  readonly onEnter: g.Trigger<Spot>

  /**
   * Spot での生放送が終了した際発火されます.
   */
  readonly onLiveEnd: g.Trigger<Live>

  /**
   * 移動速度. 1フレームで移動する距離 (画面座標系) で指定します
   */
  speed: number
  /**
   * 放送者（プレイヤー）の座標
   *
   * マップ (Field) 上にいないときは undefined が返されます
   */
  readonly location?: Readonly<g.CommonOffset>

  /**
   * 現在描画されている放送者（プレイヤー）のエンティティ.
   */
  readonly view: g.E

  /**
   * 放送者（プレイヤー）が所属するマップ (Field).
   *
   * マップ (Field) 上にいないときは undefined が返されます
   */
  readonly field?: Field

  /**
   * 放送者（プレイヤー）が現在滞在中または生放送をしている Spot.
   *
   * 滞在中でない場合 undefined を返します.
   */
  readonly staying?: Spot

  /**
   * 放送者（プレイヤー）が現在向かっている Spot.
   *
   * 目的地がない場合、 undefined を返します
   */
  readonly destination?: Spot

  /**
   * 放送者（プレイヤー）が現在している生放送.
   *
   * 生放送中でない場合、 undefined を返します
   */
  readonly live?: Live

  /**
   * 放送者（プレイヤー）の現在の状態を取得します.
   */
  readonly status: BroadcasterStatus

  /**
   * ライブラリ利用者が自由に使えるフィールドです.
   */
  vars?: unknown

  /**
   * 指定したマップ (Field) に登録し、マップの上を移動できるようにします.
   *
   * 本メソッドを実行すると放送者（プレイヤー）が画面上に描画されるようになります.
   *
   * @param field 登録先マップ
   */
  standOn(field: Field): void

  /**
   * 指定した Spot の場所にワープします.
   *
   * 移動速度 {@link speed} の制約は受けず、移動は瞬間で完了します.
   * 放送者（プレイヤー）はマップ (Field) を登録している必要があります.
   * 放送者（プレイヤー）は移動中でない必要があります. 移動中の場合は停止させてください.
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
   * 放送者（プレイヤー）はマップ (Field) を登録している必要があります.
   * 放送者（プレイヤー）は移動中でない必要があります. 移動中の場合は停止させてください.
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
   * 放送者（プレイヤー）はマップ (Field) を登録している必要があります.
   * 放送者（プレイヤー）は移動中でない場合、実行に失敗します.
   *
   * @see standOn
   * @see destination
   */
  stop(): void

  /**
   * 生放送が開始したことを通知します.
   *
   * Spot に滞在している必要があります
   *
   * 本メソッドは自動で呼び出されるため、
   * 本ライブラリ利用者が実行する必要はありません.
   *
   * @param live 開始された生放送
   * @internal
   */
  goToLive(live: Live): void

  /**
   * 生放送が終わったため、再びマップで移動可能状態にします.
   *
   * 生放送中でない場合、実行に失敗します.
   * Spot に滞在している必要があります.
   *
   * 本メソッドは自動で呼び出されるため、
   * 本ライブラリ利用者が実行する必要はありません.
   *
   * @internal
   */
  backFromLive(): void
}

export interface BroadcasterOptions {
  scene: g.Scene
  asset: g.ImageAsset
  speed: number
  location: g.CommonOffset
  vars: unknown
}

export class BroadcasterImpl implements Broadcaster {
  readonly onEnter = new g.Trigger<Spot>()
  readonly onLiveEnd = new g.Trigger<Live>()
  vars?: unknown

  private _speed: number
  private _field?: Field
  private readonly _view: g.E
  private _staying?: Spot
  private _destination?: Spot
  private _status: BroadcasterStatus = 'non-field'
  private _tween?: Tween
  private _live?: Live

  constructor ({ scene, asset, speed, location, vars }: BroadcasterOptions) {
    this._speed = speed
    this._view = new g.Sprite({
      scene,
      src: asset,
      x: location.x,
      y: location.y,
      anchorX: 0.5,
      anchorY: 0.5
    })
    this.vars = vars
  }

  standOn (field: Field): void {
    if (this._field && this._field !== field) {
      throw new Error('このbroadcasterはすでに異なるfieldに配置されているので、指定のfieldに配置できません.' +
        ' broadcasterはただ一人である必要があり、fieldには複数のbroadcasterを配置できません')
    }

    this._field = field
    this._status = 'stopping-on-ground'

    if (!field.broadcaster) {
      field.addBroadcaster(this)
    }
  }

  jumpTo (spot: Spot): void {
    if (!spot.field || !spot.location) {
      throw new Error('指定したspotがfieldに配置されていないためワープに失敗しました. spotをfieldに配置してください')
    }
    if (!this._field || !this.location) {
      throw new Error('broadcasterがfieldに配置されていないためワープに失敗しました. broadcasterをfieldに配置してください')
    }
    if (this._field !== spot.field) {
      throw new Error('指定したspotがbroadcasterと異なるfieldに配置されているためワープに失敗しました. 同じfieldに配置されたspotを指定してください')
    }
    if (this._destination) {
      throw new Error('broadcasterは現在移動中のためワープに失敗しました. broadcasterの移動を停止してください')
    }
    if (spot.status === 'disabled') {
      throw new Error('指定したspotが目的地として設定されることを禁止しているためワープに失敗しました. spotを訪問許可状態にしてください')
    }
    if (!spot.screen) {
      throw new Error('screenが設定されていないspotに到達したため、生放送の開始に失敗しました. spotにscreenを設定してください')
    }
    if (this._live) {
      throw new Error('生放送中のためワープに失敗しました. 生放送が終わってから実行してください')
    }

    this._view.x = spot.location.x
    this._view.y = spot.location.y

    this._destination = spot
    spot.markAsVisited()
    this._destination = undefined
    this._staying = spot

    this.onEnter.fire(spot)
    spot.screen.startLive(this)
  }

  departTo (spot: Spot): void {
    if (!spot.field) {
      throw new Error('指定したspotがfieldに配置されていないため移動先の設定に失敗しました. spotをfieldに配置してください')
    }
    if (!this._field) {
      throw new Error('broadcasterがfieldに配置されていないため移動先の設定に失敗しました. broadcasterをfieldに配置してください')
    }
    if (this._field !== spot.field) {
      throw new Error('指定したspotがbroadcasterと異なるfieldに配置されているため移動先の設定に失敗しました. 同じfieldに配置されたspotを指定してください')
    }
    if (this._destination || this._tween) {
      throw new Error('broadcasterは現在移動中のため移動先の設定に失敗しました. broadcasterの移動を停止してください')
    }
    if (spot.status === 'disabled') {
      throw new Error('指定したspotが目的地として設定されることを禁止しているため移動先の設定に失敗しました. spotを訪問許可状態にしてください')
    }
    if (!spot.screen) {
      throw new Error('screenが設定されていないため移動先の設定に失敗しました. spotにscreenを設定してください')
    }
    if (this._live) {
      throw new Error('生放送中のため移動先の設定に失敗しました. 生放送が終わってから実行してください')
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
      spot.screen!.startLive(this)
    })
    this._status = 'moving'

    if (spot.status !== 'target') {
      spot.setAsDestination()
    }
  }

  stop (): void {
    if (!this._field) {
      throw new Error('broadcasterがfieldに配置されていないため移動の停止に失敗しました. broadcasterをfieldに配置してください')
    }
    if (!this._destination || !this._tween) {
      throw new Error('broadcasterは現在移動中でないため移動の停止に失敗しました. broadcasterの移動中に停止命令を実行してください')
    }

    const oldDestination = this._destination
    this._field.enableSpotExcept(oldDestination)
    this._destination = undefined
    this._tween.cancel()
    this._tween = undefined
    this._status = 'stopping-on-ground'

    if (oldDestination.status === 'target') {
      oldDestination.unsetAsDestination()
    }
  }

  goToLive (live: Live): void {
    if (!this._field) {
      throw new Error('broadcasterがfieldに配置されていないため生放送の開始に失敗しました. broadcasterをfieldに配置してください')
    }
    if (!this._staying) {
      throw new Error('spotに滞在していない状態で生放送を開始しようとしました. spotに到着してから実行してください')
    }
    if (!(live instanceof this._staying.liveClass)) {
      throw new Error('開始した生放送がspotに紐づけられたものと異なります. 滞在中のspotで開始した生放送を指定してください')
    }
    if (this._live) {
      throw new Error('生放送中の状態で別の生放送を開始しようとしました. 生放送が終了してから実行してください')
    }
    this._view.hide()
    this._field.disableSpotExcept(this._staying)
    this._staying.disable()
    this._live = live
    this._status = 'on-air'
  }

  backFromLive (): void {
    if (!this._field) {
      throw new Error('broadcasterがfieldに配置されていないため生放送の終了に失敗しました. broadcasterをfieldに配置してください')
    }
    if (!this._staying) {
      throw new Error('spotに滞在していない状態で生放送を終了しようとしました. spotから離れる前に実行してください')
    }
    if (this._status !== 'on-air') {
      throw new Error('生放送中でない状態で生放送終了後処理を実行しようとしました. broadcasterが生放送中であることを確認してください')
    }
    this._view.show()
    this._field.enableSpotExcept(this._staying)
    this._staying.enable()
    const live = this._live as Live
    this._live = undefined
    this._status = 'staying-in-spot'
    this.onLiveEnd.fire(live)
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

  get live (): Live | undefined {
    return this._live
  }

  get status (): BroadcasterStatus {
    return this._status
  }
}
