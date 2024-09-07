import { Spot } from './spot'
import { Broadcaster } from './broadcaster'

/**
 * 放送者（プレイヤー） ({@link Broadcaster}) とスポット ({@link Spot}) が配置され、ゲームがプレイされる舞台.
 *
 * {@link FieldBuilder} を使ってインスタンスを作成してください.
 */
export interface Field {
  /**
   * マップの領域座標.
   *
   * {@link view} に値が登録されているとき値を返します.
   */
  readonly area?: Readonly<g.CommonArea>

  /**
   * Broadcaster, Spot を描画するエンティティ.
   *
   * 登録されている Broadcaster, Spot は本エンティティの子として描画されます
   */
  view?: g.E

  /**
   * マップ上に存在する Broadcaster を取得します
   */
  readonly broadcaster?: Broadcaster

  /**
   * マップ上に存在する Spot 一覧を取得します
   */
  readonly spots: readonly Spot[]

  /**
   * ライブラリ利用者が自由に使えるフィールドです.
   */
  vars?: unknown

  /**
   * 指定した Broadcaster をマップに配置します
   *
   * 配置すると Broadcaster ーはマップ上を移動可能になります.
   * 放送者（プレイヤー）は一人のみ配置可能です.
   *
   * @param broadcaster 配置する Broadcaster
   */
  addBroadcaster(broadcaster: Broadcaster): void

  /**
   * 指定した Spot をマップに配置します.
   *
   * 配置すると Broadcaster は Spot を目的地として選択できるようになります.
   *
   * @param spot 配置する Spot
   */
  addSpot(spot: Spot): void

  /**
   * 指定した Spot 以外を Broadcaster が目的地に選択できないようにします.
   *
   * @param spot 目的地に設定する Spot
   */
  disableSpotExcept(spot: Spot): void

  /**
   * 指定した Spot 以外を Broadcaster が目的地として選択できるようにします.
   */
  enableSpotExcept(spot: Spot): void
}

export class FieldImpl implements Field {
  vars?: unknown
  private _view?: g.E
  private readonly _spots: Set<Spot> = new Set<Spot>()
  private _broadcaster?: Broadcaster

  addBroadcaster (broadcaster: Broadcaster): void {
    if (this._broadcaster && this._broadcaster !== broadcaster) {
      throw new Error('このfieldにはすでに異なるbroadcasterが配置されているので、指定のbroadcasterを配置できません.' +
        ' broadcasterはただ一人である必要があり、fieldには複数のbroadcasterを配置できません')
    }
    if (broadcaster.field && broadcaster.field !== this) {
      throw new Error('指定のbroadcasterはすでに異なるfieldに配置されているので、このfieldに配置できません.' +
        ' broadcasterはただ一人である必要があり、broadcasterは複数のfieldに配置できません')
    }

    this._broadcaster = broadcaster
    if (this._view) {
      this._view.append(broadcaster.view)
    }

    if (!broadcaster.field) {
      broadcaster.standOn(this)
    }
  }

  addSpot (spot: Spot): void {
    if (spot.field && spot.field !== this) {
      throw new Error('指定のspotはすでに異なるfieldに配置されているので、このfieldに配置できません.' +
        ' spotは複数のfieldに配置できないので、fieldごとにspotを作成してください')
    }

    this._spots.add(spot)
    if (this._view) {
      this._view.append(spot.view)
    }

    if (!spot.field) {
      spot.deployOn(this)
    }
  }

  disableSpotExcept (spot: Spot): void {
    for (const s of [...this._spots].filter(sp => sp !== spot)) {
      s.disable()
    }
  }

  enableSpotExcept (spot: Spot): void {
    for (const s of [...this._spots].filter(sp => sp !== spot)) {
      s.enable()
    }
  }

  get view (): g.E | undefined {
    return this._view
  }

  set view (view: g.E | undefined) {
    this._view = view
    for (const s of this._spots) {
      if (this._view) {
        this._view.append(s.view)
      } else {
        s.view.remove()
      }
    }
    if (this._broadcaster) {
      if (this._view) {
        this._view.append(this._broadcaster.view)
      } else {
        this._broadcaster.view.remove()
      }
    }
  }

  get area (): Readonly<g.CommonArea> | undefined {
    return this._view
      ? {
          x: this._view.x,
          y: this._view.y,
          width: this._view.width,
          height: this._view.height
        }
      : undefined
  }

  get broadcaster (): Broadcaster | undefined {
    return this._broadcaster
  }

  get spots (): readonly Spot[] {
    return [...this._spots]
  }
}
