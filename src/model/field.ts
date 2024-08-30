import { Spot } from './spot'
import { Player } from './player'

/**
 * プレイヤー (Player) とスポット (Spot) が配置され、ゲームがプレイされる舞台.
 */
export interface Field {
  /**
   * マップの領域座標.
   *
   * view に値が登録されているとき値を返します.
   */
  readonly area?: Readonly<g.CommonArea>

  /**
   * player, spot を描画するエンティティ.
   *
   * 登録されている player, spot は本エンティティの子として描画されます
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
   * 配置するとプレイヤーはマップ上を移動可能になります.
   *
   * @param player 配置するプレイヤー
   */
  addPlayer(player: Player): void

  /**
   * 指定した Spot をマップに配置します.
   *
   * 配置するとプレイヤーは Spot を目的地として選択できるようになります.
   *
   * @param spot 配置するスポット
   */
  addSpot(spot: Spot): void

  /**
   * 指定した Spot 以外を Player が目的地に選択できないようにします.
   *
   * @param spot 目的地に設定する Spot
   */
  disableSpotExcept(spot: Spot): void

  /**
   * 指定した Spot 以外を  Player が目的地として選択できるようにします.
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
      s.view.parent = this._view
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
