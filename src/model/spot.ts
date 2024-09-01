import { SpotImageConfig } from '../builder/spotConfig'
import { Field } from './field'
/**
 * スポットの状態
 *
 * "non-deployed": マップ上に配置されていない.
 *
 * "enabled": プレイヤーが訪問可能である.
 *
 * "target": プレイヤーの目的地に設定されている.
 *
 * "disabled": プレイヤーの訪問を受け付けない.
 */
export type SpotStatus = 'non-deployed' | 'enabled' | 'target' | 'disabled'

export interface Spot {
  /**
   * スポットの座標
   *
   * マップ field 上に配置されていないときは undefined が返されます
   */
  readonly location?: Readonly<g.CommonOffset>

  /**
   * 現在描画されているスポットのエンティティ.
   */
  readonly view: g.E

  /**
   * 各場面における画像アセット一覧を取得します
   */
  readonly assets: Readonly<SpotImageConfig>

  /**
   * Spot が登録されたマップを取得します.
   *
   * マップ field 上に配置されていないときは undefined が返されます
   */
  readonly field?: Field

  /**
   * Spot の状態を取得します.
   */
  readonly status: SpotStatus

  /**
   * 指定したマップに登録します.
   *
   * 登録することで Player は Spot を訪問し、生放送できるようになります.
   * 登録すると Spot は画面に描画されるようになります.
   *
   * @param field 登録先のマップ
   */
  deployOn(field: Field): void

  /**
   * プレイヤーが目的地としていると設定します.
   */
  setAsDestination(): void

  /**
   * 目的地として設定されていることを解除します.
   */
  unsetAsDestination(): void

  /**
   * プレイヤーが目的地として選択できない状態にします.
   */
  disable(): void

  /**
   * プレイヤーが目的地として選択できる状態にします.
   */
  enable(): void
}

export class SpotImpl implements Spot {
  private readonly _view: g.Sprite
  private _field?: Field
  private _status: SpotStatus = 'non-deployed'

  // eslint-disable-next-line no-useless-constructor
  constructor (scene: g.Scene, readonly assets: Readonly<SpotImageConfig>, private readonly _location: g.CommonOffset) {
    this._view = new g.Sprite({ scene, src: assets.normal, ..._location })
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
    if (!this._field.player) {
      throw new Error('playerがfieldに配置されていないため移動先としての設定に失敗しました. playerをfieldに配置してください')
    }

    this._status = 'target'

    if (this._field.player.destination !== this) {
      this._field.player.departTo(this)
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

    // status が target になった時点でplayerが存在するはずなので下記は非到達
    // istanbul ignore if
    if (!this._field.player) {
      throw new Error('playerがfieldに配置されていないため移動先としての設定に失敗しました. playerをfieldに配置してください')
    }

    this._status = 'enabled'
    this._view.src = this.assets.normal
    this._view.invalidate()

    if (this._field.player.destination === this) {
      this._field.player.stop()
    }
  }

  enable (): void {
    if (!this._field) {
      throw new Error('spotがfieldに配置されていないため訪問先として指定可能にできませんでした. spotをfieldに配置してください')
    }
    this._status = 'enabled'
    this._view.src = this.assets.normal
    this._view.invalidate()
  }

  disable (): void {
    if (!this._field) {
      throw new Error('spotがfieldに配置されていないため訪問先として指定不可能にできませんでした. spotをfieldに配置してください')
    }
    this._status = 'disabled'
    this._view.src = this.assets.disabled
    this._view.invalidate()
  }

  get field (): Field | undefined {
    return this._field
  }

  get view (): g.E {
    return this._view
  }

  get location (): Readonly<g.CommonOffset> | undefined {
    if (this._field) {
      return { ...this._location }
    }
    return undefined
  }

  get status (): SpotStatus {
    return this._status
  }
}
