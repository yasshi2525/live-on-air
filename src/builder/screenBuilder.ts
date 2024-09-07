import { Screen, ScreenImpl } from '../model/screen'

/**
 * 生放送環境 ({@link Screen}) を簡便に作るためのクラス.
 *
 * Screen は本クラスを用いて作成してください.
 */
export class ScreenBuilder {
  // eslint-disable-next-line no-useless-constructor
  constructor (private readonly scene: g.Scene) {}

  /**
   * Screen を作成します.
   */
  build (): Screen {
    return new ScreenImpl(this.scene)
  }
}
