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
