import { Field } from './field'

/**
 * プレイヤー.
 *
 * プレイヤーはマップの上 (Field) を移動でき、 Spot を訪問すると生放送します.
 */
export interface Player {
  /**
   * プレイヤーの座標
   *
   * マップ field 上にいないときは undefined が返されます
   */
  readonly location?: Readonly<g.CommonOffset>

  /**
   * プレイヤーが所属するマップ.
   *
   * マップ上にいないときは undefined が返されます
   */
  readonly field?: Field

  /**
   * 指定したマップに登録し、マップの上を移動できるようにします.
   *
   * 本メソッドを実行するとプレイヤーが画面上に描画されるようになります.
   *
   * @param field 登録先マップ
   */
  standOn(field: Field): void
}

export class PlayerImpl implements Player {
  private _field?: Field
  private _location?: g.CommonOffset

  standOn (field: Field): void {
    if (this._field && this._field !== field) {
      throw new Error('このplayerはすでに異なるfieldに配置されているので、指定のfieldに配置できません.' +
        ' playerはただ一人である必要があり、fieldには複数のplayerを配置できません')
    }

    this._field = field
    this._location = { x: 0, y: 0 }

    if (!field.player) {
      field.addPlayer(this)
    }
  }

  get location (): Readonly<g.CommonOffset> | undefined {
    if (this._location) {
      return { ...this._location }
    }
    return undefined
  }

  get field (): Field | undefined {
    return this._field
  }
}
