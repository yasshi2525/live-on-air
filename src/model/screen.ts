import { Spot } from './spot'
import { Live } from './live'
import { Broadcaster } from './broadcaster'
import { LiveContext } from './liveContext'

/**
 * {@link Broadcaster} が {@link Spot} を訪問すると開始される 生放送 ({@link Live}) を
 * 画面に描画します.
 *
 * {@link ScreenBuilder} を使ってインスタンスを作成してください.
 */
export interface Screen {
  /**
   * 生放送が始まった際に発火するトリガ.
   */
  readonly onLiveStart: g.Trigger<Live>
  /**
   * 生放送スクリーンの領域座標.
   *
   * {@link container} に値が登録されているとき値を返します.
   */
  readonly area?: Readonly<g.CommonArea>

  /**
   * 現在放送中の Live インスタンスを取得します.
   *
   * 放送中でない場合 undefined を返します.
   */
  readonly nowOnAir?: Live

  /**
   * Live を描画するエンティティ.
   *
   * 生放送時の描画内容は本エンティティの子に格納されます.
   */
  container?: g.E

  /**
   * Live を開始する際、この値でデフォルトの LiveContext に上書きします.
   */
  customLiveContext?: Partial<LiveContext>

  /**
   * ライブラリ利用者が自由に使えるフィールドです.
   */
  vars?: unknown

  /**
   * Spot を登録します.
   *
   * @param spot 訪問時に生放送を開始するスポット
   */
  addSpot (spot: Spot): void

  /**
   * Broadcaster が Spot を訪問したため、登録された生放送を開始します.
   *
   * Broadcaster は Spot に滞在している必要があります.
   *
   * 本メソッドは Spot 到着時に自動で呼び出されるため、
   * ライブラリ利用者が実行する必要はありません.
   *
   * @param broadcaster Spot を訪問した Broadcaster
   * @internal
   */
  startLive (broadcaster: Broadcaster): void

}

export interface ScreenOptions {
  scene: g.Scene
  vars: unknown
}

export class ScreenImpl implements Screen {
  readonly onLiveStart = new g.Trigger<Live>()
  vars?: unknown
  private readonly scene: g.Scene
  private _container?: g.E
  private readonly _view: g.E
  private _now?: Live
  private _customLiveContext?: Partial<LiveContext>

  constructor ({ scene, vars }: ScreenOptions) {
    this.scene = scene
    this._view = new g.E({ scene })
    this.vars = vars
  }

  addSpot (spot: Spot): void {
    if (spot.screen && spot.screen !== this) {
      throw new Error('指定されたspotにはすでに他のscreenが登録されています. screenが未登録なspotを指定してください')
    }
    spot.attach(this)
  }

  startLive (broadcaster: Broadcaster): void {
    if (!broadcaster.field) {
      throw new Error('broadcasterがfield上に配置されていません. broadcasterをfieldに配置してから実行してください')
    }
    if (!broadcaster.staying) {
      throw new Error('broadcasterが放送準備ができていません. broadcasterがspotに到着してから実行してください')
    }
    if (broadcaster.live || this._now) {
      throw new Error('放送中にもかかわらず、新規放送を開始しようとしました. 放送終了後に実行してください')
    }
    const liveContainer = new g.E({
      scene: this.scene,
      parent: this._view,
      width: this._view.width,
      height: this._view.height
    })
    const context: LiveContext = {
      scene: this.scene,
      screen: this,
      field: broadcaster.field,
      spot: broadcaster.staying,
      broadcaster,
      container: liveContainer,
      vars: undefined,
      ...(this._customLiveContext ?? {})
    }
    const live = new (broadcaster.staying.liveClass!)()
    this._now = live
    broadcaster.goToLive(live)
    live.start(context, () => {
      if (!live.satisfiesUnlockSpotCondition || live.satisfiesUnlockSpotCondition()) {
        context.field.unlock(context.spot)
      }
      this._now = undefined
      liveContainer.destroy()
      broadcaster.backFromLive()
    })
    this.onLiveStart.fire(live)
  }

  get container (): g.E | undefined {
    return this._container
  }

  set container (view: g.E | undefined) {
    this._container = view
    if (this._container) {
      this._view.width = this._container.width
      this._view.height = this._container.height
      this._view.modified()
      this._container.append(this._view)
    } else {
      this._view.remove()
    }
  }

  get nowOnAir (): Live | undefined {
    return this._now
  }

  get area (): Readonly<g.CommonArea> | undefined {
    return this._container
      ? {
          x: this._container.x,
          y: this._container.y,
          width: this._container.width,
          height: this._container.height
        }
      : undefined
  }

  get customLiveContext (): Partial<LiveContext> | undefined {
    return this._customLiveContext
  }

  set customLiveContext (value: Partial<LiveContext>) {
    this._customLiveContext = value
  }
}
