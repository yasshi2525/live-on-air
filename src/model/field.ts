import { Spot } from './spot'
import { Player } from './player'

/**
 * プレイヤー ({@link Player}) とスポット ({@link Spot}) が配置され、ゲームがプレイされる舞台.
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
   * Player, Spot を描画するエンティティ.
   *
   * 登録されている Player, Spot は本エンティティの子として描画されます
   */
  view?: g.E

  /**
   * マップ上に存在する Player を取得します
   */
  readonly player?: Player

  /**
   * マップ上に存在する Spot 一覧を取得します
   */
  readonly spots: readonly Spot[]

  /**
   * 指定した Player をマップに配置します
   *
   * 配置すると Player ーはマップ上を移動可能になります.
   *
   * @param player 配置する Player
   */
  addPlayer(player: Player): void

  /**
   * 指定した Spot をマップに配置します.
   *
   * 配置すると Player は Spot を目的地として選択できるようになります.
   *
   * @param spot 配置する Spot
   */
  addSpot(spot: Spot): void

  /**
   * 指定した Spot 以外を Player が目的地に選択できないようにします.
   *
   * @param spot 目的地に設定する Spot
   */
  disableSpotExcept(spot: Spot): void

  /**
   * 指定した Spot 以外を Player が目的地として選択できるようにします.
   */
  enableSpotExcept(spot: Spot): void
}

export class FieldImpl implements Field {
  private _view?: g.E
  private readonly _spots: Set<Spot> = new Set<Spot>()
  private _player?: Player

  addPlayer (player: Player): void {
    if (this._player && this._player !== player) {
      throw new Error('このfieldにはすでに異なるplayerが配置されているので、指定のplayerを配置できません.' +
        ' playerはただ一人である必要があり、fieldには複数のplayerを配置できません')
    }
    if (player.field && player.field !== this) {
      throw new Error('指定のplayerはすでに異なるfieldに配置されているので、このfieldに配置できません.' +
        ' playerはただ一人である必要があり、playerは複数のfieldに配置できません')
    }

    this._player = player
    if (this._view) {
      this._view.append(player.view)
    }

    if (!player.field) {
      player.standOn(this)
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
    if (this._player) {
      if (this._view) {
        this._view.append(this._player.view)
      } else {
        this._player.view.remove()
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

  get player (): Player | undefined {
    return this._player
  }

  get spots (): readonly Spot[] {
    return [...this._spots]
  }
}
