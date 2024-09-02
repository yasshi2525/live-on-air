/**
 * Layer を新規作成する際の各種設定を格納します.
 */
export interface SceneLayerConfigure {
  /**
   * 作成する layer のマップの領域情報を設定します.
   *
   * 本領域上に player, spot が配置されます.
   *
   * @param area マップのレイアウト情報
   */
  field (area: g.CommonArea): SceneLayerConfigure

  /**
   * 作成する layer のマップの領域情報を取得します.
   *
   * 本領域上に player, spot が配置されます.
   */
  field (): Readonly<g.CommonArea>
}

export class SceneLayerConfigureImpl implements SceneLayerConfigure {
  protected _field?: g.CommonArea

  field (layout: g.CommonArea): SceneLayerConfigure

  field (): Readonly<g.CommonArea>

  field (args?: g.CommonArea): SceneLayerConfigure | Readonly<g.CommonArea> {
    if (args) {
      if (!this._field) {
        this._field = { ...args }
      } else {
        this._field.x = args.x
        this._field.y = args.y
        this._field.width = args.width
        this._field.height = args.height
      }
      return this
    }
    if (!this._field) {
      throw new Error('領域が設定されていません.')
    }
    return { ...this._field }
  }
}
