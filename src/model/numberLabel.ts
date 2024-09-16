/**
 * {@link NumberLabel} の状態.
 *
 * 'enabled': 値の変更を許可します.
 *
 * 'disabled': 値を変更しようとしても無視します.
 */
export type NumberLabelStatus = 'enabled' | 'disabled'

/**
 * ラベル付き数値を制御、描画します.
 */
export interface NumberLabel {
  /**
   * 値が変化したとき発火されるトリガ
   */
  readonly onValue: g.Trigger<number>
  /**
   * 描画に使用するフォントを取得します.
   */
  readonly font: g.Font

  /**
   * 表示する数値の桁数を取得します.
   */
  readonly digit: number

  /**
   * 数値に前置するテキストを取得します
   */
  readonly prefix: string

  /**
   * 数値に後置するテキストを取得します
   */
  readonly suffix: string

  /**
   * 数値を取得します.
   */
  readonly value: number

  /**
   * 数値の変更を受け付けるか状態を取得します
   */
  readonly status: NumberLabelStatus

  /**
   * ラベル付き数値を描画するエンティティ. (このエンティティの子にラベルが登録されます.)
   */
  container?: g.E

  /**
   * 加算します.
   *
   * @param value 加算する値
   */
  add (value: number): void

  /**
   * 引数の値に設定します.
   *
   * @param value 設定する値
   */
  set (value: number): void

  /**
   * 値を設定できるようにします.
   */
  enable (): void

  /**
   * 値を設定しようとしても無視します.
   */
  disable (): void
}

export interface NumberLabelOptions {
  scene: g.Scene
  value: number
  font: g.Font
  digit: number
  prefix: string
  suffix: string
  textAlign: g.TextAlignString
}

export class NumberLabelImpl implements NumberLabel {
  readonly onValue = new g.Trigger<number>()
  private readonly scene: g.Scene
  private _container?: g.E
  private readonly _font: g.Font
  private readonly _digit: number
  private readonly _prefix: string
  private readonly _suffix: string
  private readonly _view: g.Label
  private _value: number
  private _status: NumberLabelStatus = 'disabled'
  constructor ({ scene, value, font, digit, prefix, suffix, textAlign }: NumberLabelOptions) {
    this.scene = scene
    this._font = font
    this._digit = digit
    this._prefix = prefix
    this._suffix = suffix
    this._value = value
    this._view = new g.Label({
      scene,
      font,
      text: this.format(),
      textAlign,
      widthAutoAdjust: false,
      anchorY: 0.5
    })
  }

  add (value: number): void {
    if (this._status === 'enabled') {
      this._value += value
      this.updateTextIf()
      this.onValue.fire(value)
    }
  }

  set (value: number): void {
    if (this._status === 'enabled') {
      this._value = value
      this.updateTextIf()
      this.onValue.fire(value)
    }
  }

  enable (): void {
    this._status = 'enabled'
  }

  disable () {
    this._status = 'disabled'
  }

  get status (): NumberLabelStatus {
    return this._status
  }

  get container (): g.E | undefined {
    return this._container
  }

  set container (container: g.E | undefined) {
    if (container) {
      container.append(this._view)
      this._view.width = container.width
      this._view.y = container.height / 2
      this._view.modified()
    } else {
      this._view.remove()
    }
    this._container = container
  }

  get font (): g.Font {
    return this._font
  }

  get digit (): number {
    return this._digit
  }

  get prefix (): string {
    return this._prefix
  }

  get suffix (): string {
    return this._suffix
  }

  get value (): number {
    return this._value
  }

  private format (): string {
    return `${this.prefix}${this.value.toString().padStart(this._digit)}${this.suffix}`
  }

  private updateTextIf () {
    const oldText = this._view.text
    const newText = this.format()
    if (oldText !== newText) {
      this._view.text = this.format()
      this._view.invalidate()
    }
  }
}
