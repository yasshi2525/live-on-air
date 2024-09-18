import { Field } from './field'
import { SpotAssetRecord } from '../value/spotConfig'
import { Screen } from './screen'
import { Live } from './live'
/**
 * スポット ({@link Spot}) の状態
 *
 * "non-deployed": マップ上に配置されていない.
 *
 * "enabled": 放送者（プレイヤー）が訪問可能である.
 *
 * "target": 放送者（プレイヤー）の目的地に設定されている.
 *
 * "disabled": 放送者（プレイヤー）の訪問を受け付けない.
 */
export type SpotStatus = 'non-deployed' | 'enabled' | 'target' | 'disabled'

/**
 * スポット.
 *
 * スポットはマップ ({@link Field}) の上に存在し、放送者（プレイヤー） ({@link Broadcaster}) が訪問すると生放送が始まります.
 */
export interface Spot {
  /**
   * スポットの座標
   *
   * マップ Field 上に配置されていないときは undefined が返されます
   */
  readonly location?: Readonly<g.CommonOffset>

  /**
   * 現在描画されているスポットのエンティティ.
   */
  readonly view: g.E

  /**
   * 各場面における画像アセット一覧を取得します
   */
  readonly assets: Readonly<SpotAssetRecord>

  /**
   * Spot が登録されたマップを取得します.
   *
   * マップ Field 上に配置されていないときは undefined が返されます
   */
  readonly field?: Field

  /**
   * Spot の状態を取得します.
   */
  readonly status: SpotStatus

  /**
   * ライブラリ利用者が自由に使えるフィールドです.
   */
  vars?: unknown

  /**
   * 過去に放送者（プレイヤー）が訪問したかどうか取得します.
   */
  readonly visited: boolean

  /**
   * 訪問時に開始される生放送を描画する環境情報を取得します.
   *
   * 未登録の場合 undefined が返されます
   */
  readonly screen?: Screen

  /**
   * 訪問時に開始する生放送を取得します.
   *
   * @return 生放送処理が定義されたクラス名
   */
  readonly liveClass: new () => Live

  /**
   * 指定したマップ (Field) に登録します.
   *
   * 登録することで Broadcaster は Spot を訪問し、生放送できるようになります.
   * 登録すると Spot は画面に描画されるようになります.
   *
   * @param field 登録先のマップ
   */
  deployOn(field: Field): void

  /**
   * 放送者（プレイヤー）が目的地としていると設定します.
   */
  setAsDestination(): void

  /**
   * 目的地として設定されていることを解除します.
   */
  unsetAsDestination(): void

  /**
   * 放送者（プレイヤー）が訪問した際、生放送を開始するためのスクリーン環境情報を登録します.
   *
   * @param screen
   */
  attach(screen: Screen): void

  /**
   * 放送者（プレイヤー）が目的地として選択できない状態にします.
   */
  disable(): void

  /**
   * 放送者（プレイヤー）が目的地として選択できる状態にします.
   */
  enable(): void

  /**
   * 引数で指定された Spot を攻略しなければ訪問可能にならないようにします.
   *
   * @param spot 前提となる Spot
   */
  lockedBy(spot: Spot): void

  /**
   * この Spot が訪問可能になるまで攻略が必要な Spot 一覧を取得します.
   */
  lockedBy(): readonly Spot[]

  /**
   * 引数で指定された Spot が攻略されたことを通知します.
   *
   * @param spot 攻略された Spot
   */
  unlock(spot: Spot): void

  /**
   * 放送者（プレイヤー）が訪問済であると登録します.
   *
   * 放送者（プレイヤー）が滞在している必要があります.
   *
   * 本メソッドは放送者（プレイヤー）移動完了時に自動で呼び出されるため、
   * 本ライブラリ利用者が利用する必要はありません.
   *
   * @internal
   */
  markAsVisited(): void
}

export interface SpotOptions {
  scene: g.Scene
  image: Readonly<SpotAssetRecord>
  location: g.CommonOffset
  liveClass: new () => Live
  vars: unknown
}

export class SpotImpl implements Spot {
  vars?: unknown

  private readonly _location: g.CommonOffset
  private readonly _liveClass: new () => Live
  readonly assets: Readonly<SpotAssetRecord>
  private readonly _view: g.Sprite
  private _field?: Field
  private _status: SpotStatus = 'non-deployed'
  private _visited = false
  private _screen?: Screen
  private readonly _lockedBy = new Set<Spot>()

  constructor ({ scene, image, location, liveClass, vars } : SpotOptions) {
    this._location = { x: location.x, y: location.y }
    this.assets = {
      locked: image.locked,
      unvisited: image.unvisited,
      disabled: image.disabled,
      normal: image.normal
    }
    this._liveClass = liveClass
    this.vars = vars
    this._view = new g.Sprite({
      scene,
      src: image.normal,
      x: location.x,
      y: location.y,
      anchorX: 0.5,
      anchorY: 0.5,
      touchable: true
    })
    this.view.onPointDown.add(() => {
      if (this.status === 'target') {
        this.unsetAsDestination()
      } else if (this.status === 'enabled') {
        this.setAsDestination()
      }
    })
  }

  deployOn (field: Field): void {
    if (this._field && this._field !== field) {
      throw new Error('このspotはすでに異なるfieldに配置されているので、指定のfieldに配置できません.' +
        ' spotは複数のfieldに配置できないので、fieldごとにspotを作成してください')
    }

    this._field = field
    this._status = 'enabled'
    this._view.src = this.assets.unvisited
    this._view.invalidate()

    if (!field.spots.some(sp => sp === this)) {
      field.addSpot(this)
    }
  }

  setAsDestination ():void {
    if (!this._field) {
      throw new Error('spotがfieldに配置されていないため移動先としての設定に失敗しました. spotをfieldに配置してください')
    }
    if (!this._field.broadcaster) {
      throw new Error('broadcasterがfieldに配置されていないため移動先としての設定に失敗しました. broadcasterをfieldに配置してください')
    }

    this._status = 'target'

    if (this._field.broadcaster.destination !== this) {
      this._field.broadcaster.departTo(this)
    }
  }

  unsetAsDestination (): void {
    if (!this._field) {
      throw new Error('spotがfieldに配置されていないため移動先設定の解除に失敗しました. spotをfieldに配置してください')
    }
    if (this._status !== 'target') {
      throw new Error('spotは移動先として設定されていないため、移動先設定の解除に失敗しました.' +
        ' 移動先として設定されているspotに対して解除命令を実行してください')
    }

    // status が target になった時点でbroadcasterが存在するはずなので下記は非到達
    // istanbul ignore if
    if (!this._field.broadcaster) {
      throw new Error('broadcasterがfieldに配置されていないため移動先としての設定に失敗しました. broadcasterをfieldに配置してください')
    }

    this._status = 'enabled'
    this._view.src = this._visited ? this.assets.normal : this.assets.unvisited
    this._view.invalidate()

    if (this._field.broadcaster.destination === this) {
      this._field.broadcaster.stop()
    }
  }

  attach (screen: Screen): void {
    if (this._screen && this._screen !== screen) {
      throw new Error('spotはすでに他のscreenを登録しています. 設定するscreenが正しいか見直してください')
    }
    this._screen = screen
  }

  enable (): void {
    if (!this._field) {
      throw new Error('spotがfieldに配置されていないため訪問先として指定可能にできませんでした. spotをfieldに配置してください')
    }
    if (this._lockedBy.size > 0) {
      return
    }
    this._status = 'enabled'
    this._view.touchable = true
    this._view.src = this._visited ? this.assets.normal : this.assets.unvisited
    this._view.invalidate()
  }

  disable (): void {
    if (!this._field) {
      throw new Error('spotがfieldに配置されていないため訪問先として指定不可能にできませんでした. spotをfieldに配置してください')
    }
    if (this._lockedBy.size > 0) {
      return
    }
    this._status = 'disabled'
    this._view.touchable = false
    this._view.src = this.assets.disabled
    this._view.invalidate()
  }

  markAsVisited (): void {
    if (!this._field || !this.location) {
      throw new Error('spotがfieldに配置されていないため訪問済みステータスへの遷移に失敗しました. spotをfieldに配置してください')
    }
    if (!this._field.broadcaster || !this._field.broadcaster.location) {
      throw new Error('broadcasterがfieldに配置されていないため訪問済みステータスへの遷移に失敗しました. broadcasterをfieldに配置してください')
    }
    if (this._field.broadcaster.destination !== this) {
      throw new Error('broadcasterは異なるspotへ移動中のため訪問済みステータスへの遷移に失敗しました. broadcasterの目的地を変更してください')
    }
    if (g.Util.distanceBetweenOffsets(this.location, this._field.broadcaster.location) > 0) {
      throw new Error('broadcasterがspotに到着していないため訪問済みステータスへの遷移に失敗しました. broadcasterがspotに到着してから実行してください')
    }

    this._visited = true
  }

  lockedBy (spot: Spot): void

  lockedBy (): readonly Spot[]

  lockedBy (args?: Spot): void | readonly Spot[] {
    if (args) {
      this._lockedBy.add(args)
      this._status = 'disabled'
      this._view.touchable = false
      this._view.src = this.assets.locked
      this._view.invalidate()
    } else {
      return [...this._lockedBy]
    }
  }

  unlock (spot: Spot) {
    this._lockedBy.delete(spot)
    if (this._lockedBy.size === 0) {
      this._view.src = this.assets.disabled
      this._view.invalidate()
    }
  }

  get field (): Field | undefined {
    return this._field
  }

  get view (): g.E {
    return this._view
  }

  get location (): Readonly<g.CommonOffset> | undefined {
    if (this._field) {
      return { x: this._location.x, y: this._location.y }
    }
    return undefined
  }

  get status (): SpotStatus {
    return this._status
  }

  get visited (): boolean {
    return this._visited
  }

  get screen (): Screen | undefined {
    return this._screen
  }

  get liveClass (): (new () => Live) {
    return this._liveClass
  }
}
