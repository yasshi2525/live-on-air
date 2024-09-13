import { CommentSupplier } from './commentSupplier'
import { PrimitiveValueSupplier, ValueValidator } from '../value/value'

/**
 * 画面上に流れるコメントをゲーム画面に配置します.
 *
 * {@link CommentDeployerBuilder} を使ってインスタンスを作成してください.
 */
export interface CommentDeployer {
  /**
   * コメントを配置したとき発火されるトリガ
   */
  readonly onDeploy: g.Trigger<g.E>

  /**
   * コメントを配置するエンティティ.
   *
   * コメントは指定されたエンティティの子として登録されます.
   */
  container?: g.E

  /**
   * コメントが流れる速度. 1フレームあたりの移動座標数
   */
  speed: number

  /**
   * コメントの表示間隔 (y座標値)
   */
  readonly intervalY: number

  /**
   * 配置対象のコメント生成器一覧を取得します.
   */
  readonly suppliers: readonly CommentSupplier[]

  /**
   * コメント内容を生成するインスタンスを追加します.
   *
   * @param supplier 配置したいコメントを生成するインスタンス
   */
  subscribe (supplier: CommentSupplier): void

  /**
   * コメントを画面上に配置します.
   *
   * ライブラリ利用者はこれを呼び出す必要はありません. 自動的に呼び出されます.
   *
   * @param text コメント本文
   * @internal
   */
  deploy (text: string): void
}

export interface CommentDeployerOptions {
  scene: g.Scene
  speed: number
  intervalY: number
  font: g.Font
}

export class CommentDeployerImpl implements CommentDeployer {
  readonly onDeploy = new g.Trigger<g.E>()
  private readonly scene: g.Scene
  private readonly font: g.Font
  private readonly views: { row: number, view: g.E }[] = []
  private _container?: g.E
  private readonly _speed: PrimitiveValueSupplier<number>
  private readonly _intervalY: PrimitiveValueSupplier<number>
  private readonly _suppliers = new Set<CommentSupplier>()

  constructor ({ scene, font, speed, intervalY }: CommentDeployerOptions) {
    this.scene = scene
    this.font = font
    this._speed = PrimitiveValueSupplier.create(speed, new class extends ValueValidator<number> {
      override isInvalid (value: number): boolean {
        return value <= 0
      }

      override getMessage (value: number): string {
        return super.getMessage(value) + ' コメントの移動速度は0より大きな正の値ではなければなりません.'
      }
    }())
    this._intervalY = PrimitiveValueSupplier.create(intervalY, new class extends ValueValidator<number> {
      override isInvalid (value: number): boolean {
        return value <= 0
      }

      override getMessage (value: number): string {
        return super.getMessage(value) + ' コメントの表示間隔(y座標値)は0より大きな正の値ではなければなりません.'
      }
    }())
  }

  get container (): g.E | undefined {
    return this._container
  }

  set container (container: g.E) {
    this._container = container
    if (this._container) {
      for (const { view } of this.views) {
        this._container.append(view)
      }
    } else {
      for (const { view } of this.views) {
        view.remove()
      }
    }
  }

  get speed (): number {
    return this._speed.get()
  }

  set speed (value: number) {
    this._speed.setIf(value)
  }

  get intervalY (): number {
    return this._intervalY.get()
  }

  get suppliers (): readonly CommentSupplier[] {
    return [...this._suppliers]
  }

  subscribe (supplier: CommentSupplier) {
    if (!this._suppliers.has(supplier)) {
      this._suppliers.add(supplier)
    }
    if (!supplier.deployers.some(d => d === this)) {
      supplier.addDeployer(this)
    }
  }

  deploy (text: string): void {
    const left = this._container?.width ?? this.scene.game.width
    const bottom = this._container?.height ?? this.scene.game.height
    const full = new Set<number>()
    for (const e of this.views) {
      if (e.view.x + e.view.width > left) {
        full.add(e.row)
      }
    }
    for (let row = 0; row * this._intervalY.get() < bottom; row++) {
      if (!full.has(row)) {
        this.onDeploy.fire(this.createView(row, text))
        return
      }
    }
    this.onDeploy.fire(this.createView((this.views.at(-1)?.row ?? -1) + 1, text))
  }

  private createView (row: number, text: string): g.E {
    const view = new g.Label({
      scene: this.scene,
      parent: this._container,
      font: this.font,
      x: this._container?.width ?? this.scene.game.width,
      y: (row % (Math.ceil(this._container?.height ?? this.scene.game.height) / this.intervalY)) * this._intervalY.get(),
      text
    })
    view.onUpdate.add(() => {
      if (view.x + view.width < 0) {
        view.destroy()
        this.views.splice(this.views.findIndex(e => e.view === view), 1)
        return true
      }
      view.x -= this._speed.get()
      view.modified()
    })
    this.views.push({ row, view })
    return view
  }
}
