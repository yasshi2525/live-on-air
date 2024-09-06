import { Spot } from './spot'
import { Live } from './live'
import { Player } from './player'
import { LiveContext } from './liveContext'

/**
 * {@link Player} が {@link Spot} を訪問すると開始される 生放送 ({@link Live}) を
 * 画面に描画します.
 *
 * {@link ScreenBuilder} を使ってインスタンスを作成してください.
 */
export interface Screen {
  /**
   * 生放送スクリーンの領域座標.
   *
   * {@link view} に値が登録されているとき値を返します.
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
  view?: g.E

  /**
   * Spot を登録します.
   *
   * @param spot 訪問時に生放送を開始するスポット
   */
  addSpot (spot: Spot): void

  /**
   * Player が Spot を訪問したため、登録された生放送を開始します.
   *
   * 本メソッドは Spot 到着時に自動で呼び出されるため、
   * ライブラリ利用者が実行する必要はありません.
   *
   * @param player Spot を訪問した Player
   * @internal
   */
  startLive (player: Player): void

}

export class ScreenImpl implements Screen {
  private container?: g.E
  private readonly _view: g.E
  private _now?: Live

  constructor (private readonly scene: g.Scene) {
    this._view = new g.E({ scene })
  }

  addSpot (spot: Spot): void {
    if (spot.screen && spot.screen !== this) {
      throw new Error('指定されたspotにはすでに他のscreenが登録されています. screenが未登録なspotを指定してください')
    }
    spot.attach(this)
  }

  startLive (player: Player): void {
    if (player.status !== 'on-air' || !player.staying) {
      throw new Error('playerが放送準備ができていません. playerがspotに到着してから実行してください')
    }
    if (this._now) {
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
      spot: player.staying,
      player,
      view: liveContainer
    }
    const live = new (player.staying.liveClass!)()
    this._now = live
    live.onEnd.addOnce(() => {
      this._now = undefined
      liveContainer.destroy()
      player.backFromLive()
    })
    live.start(context)
  }

  get view (): g.E | undefined {
    return this.container
  }

  set view (view: g.E | undefined) {
    this.container = view
    if (this.container) {
      this._view.width = this.container.width
      this._view.height = this.container.height
      this._view.modified()
      this.container.append(this._view)
    } else {
      this._view.remove()
    }
  }

  get nowOnAir (): Live | undefined {
    return this._now
  }

  get area (): Readonly<g.CommonArea> | undefined {
    return this.container
      ? {
          x: this.container.x,
          y: this.container.y,
          width: this.container.width,
          height: this.container.height
        }
      : undefined
  }
}
