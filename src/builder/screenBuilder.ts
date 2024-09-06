import { Screen, ScreenImpl } from '../model/screen'

export class ScreenBuilder {
  // eslint-disable-next-line no-useless-constructor
  constructor (private readonly scene: g.Scene) {}

  build (): Screen {
    return new ScreenImpl(this.scene)
  }
}
