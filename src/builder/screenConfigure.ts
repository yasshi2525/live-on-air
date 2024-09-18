import { Screen, ScreenImpl } from '../model/screen'
import { ScreenConfig, ScreenConfigSupplier } from '../value/screenConfig'

/**
 * {@link Screen} を新規作成する際の各種設定を保持します.
 */
export interface ScreenConfigure {
  /**
   * 作成する Screen のライブラリ利用者が自由に使えるフィールドを取得します.
   */
  vars (): unknown

  /**
   * 作成する Screen のライブラリ利用者が自由に使えるフィールドを設定します.
   *
   * @param vars ライブラリ利用者が自由に使えるフィールド
   */
  vars (vars: unknown): ScreenConfigure
}

export class ScreenConfigureImpl implements ScreenConfigure {
  private readonly getter: () => ScreenConfig
  private readonly setter: (obj: Partial<ScreenConfig>) => void

  constructor (isDefault: boolean, private readonly scene: g.Scene, private readonly config: ScreenConfigSupplier) {
    this.getter = () => isDefault ? config.default() : config.get()
    this.setter = obj => isDefault ? config.defaultIf(obj) : config.setIf(obj)
  }

  vars (): unknown

  vars (vars: unknown): ScreenConfigure

  vars (args?: unknown): unknown | ScreenConfigure {
    if (arguments.length > 0) {
      this.setter({ vars: args })
      return this
    }
    return this.getter().vars
  }

  /**
   * Field を作成します.
   */
  build (): Screen {
    const config = this.config.get()
    return new ScreenImpl({ scene: this.scene, vars: config.vars })
  }
}
