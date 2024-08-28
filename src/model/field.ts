import { Spot } from './spot'
import { Player } from './player'

/**
 * プレイヤー (Player) とスポット (Spot) が配置され、ゲームがプレイされる舞台.
 */
export interface Field {
  /**
   * マップの領域座標
   */
  readonly area: Readonly<g.CommonArea>

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
}

export class FieldImpl implements Field {
  private readonly _area: g.CommonArea
  private readonly _spots: Set<Spot> = new Set<Spot>()
  private _player?: Player

  constructor (area: g.CommonArea) {
    this._area = { ...area }
  }

  addPlayer (player: Player): void {
    if (this._player && this._player !== player) {
      throw new Error('could not add player to this field because other player was already added to it')
    }
    if (player.field && player.field !== this) {
      throw new Error('could not add player because this player has already stood on other field')
    }

    this._player = player

    if (!player.field) {
      player.standOn(this)
    }
  }

  addSpot (spot: Spot): void {
    if (spot.field && spot.field !== this) {
      throw new Error('could not add spot because this spot is already deployed on other field')
    }

    this._spots.add(spot)

    if (!spot.field) {
      spot.deployOn(this)
    }
  }

  get area (): Readonly<g.CommonArea> {
    return { ...this._area }
  }

  get player (): Player | undefined {
    return this._player
  }

  get spots (): readonly Spot[] {
    return [...this._spots]
  }
}
