import { SpotImageConfig } from '../builder/spotConfig'
import { Field } from './field'

export interface Spot {
  /**
   * スポットの座標
   *
   * マップ field 上に配置されていないときは undefined が返されます
   */
  readonly location?: Readonly<g.CommonOffset>

  /**
   * 各場面における画像アセット一覧を取得します
   */
  assets: Readonly<SpotImageConfig>

  /**
   * Spot が登録されたマップを取得します.
   *
   * マップ field 上に配置されていないときは undefined が返されます
   */
  readonly field?: Field

  /**
   * 指定したマップに登録します.
   *
   * 登録することで Player は Spot を訪問し、生放送できるようになります.
   * 登録すると Spot は画面に描画されるようになります.
   *
   * @param field 登録先のマップ
   */
  deployOn(field: Field): void
}

export class SpotImpl implements Spot {
  private _field?: Field
  private _location?: g.CommonOffset

  // eslint-disable-next-line no-useless-constructor
  constructor (public assets: Readonly<SpotImageConfig>) {}

  deployOn (field: Field): void {
    if (this._field && this._field !== field) {
      throw new Error('could not deploy on target field because this spot is already deployed on other field')
    }

    this._field = field
    this._location = { x: 0, y: 0 }

    if (!field.spots.some(sp => sp === this)) {
      field.addSpot(this)
    }
  }

  get field (): Field | undefined {
    return this._field
  }

  get location (): Readonly<g.CommonOffset> | undefined {
    if (this._location) {
      return { ...this._location }
    }
    return undefined
  }
}
