import { SpotImageConfig } from '../builder/spotConfig'

export interface Spot {
  /**
   * 各場面における画像アセット一覧を取得します
   */
  assets: Readonly<SpotImageConfig>
}

export class SpotImpl implements Spot {
  // eslint-disable-next-line no-useless-constructor
  constructor (public assets: Readonly<SpotImageConfig>) {}
}
