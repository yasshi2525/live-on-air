import { LiveContext } from './liveContext'

/**
 * {@link Spot} を訪れると開始する生放送を制御します.
 *
 * 独自の生放送コンテンツを追加するためには、本インタフェースを実装したクラスを作成する必要があります.
 * なお、引数なしのコンストラクタを定義する必要がある点に留意してください.
 */
export interface Live {
  /**
   * 生放送終了を通知するトリガー.
   *
   * 下記のように初期化してください.
   *
   * ```
   * readonly onEnd = new g.Trigger()
   * ```
   */
  readonly onEnd: g.Trigger

  /**
   * 生放送が開始されると呼び出されます.
   *
   * 放送が終了した際は、必ず `this.onEnd.fire()` を呼び出してください.
   *
   * @param context 放送中に利用可能な情報が格納されています.
   */
  start (context: LiveContext): void
}

export class SampleLive implements Live {
  onEnd = new g.Trigger()
  start ({ scene, view } : LiveContext): void {
    const bg = new g.FilledRect({
      scene, parent: view, width: view.width, height: view.height, cssColor: '#ffffaa', opacity: 0.5
    })
    bg.append(new g.Label({
      scene,
      font: new g.DynamicFont({
        game: scene.game,
        fontFamily: 'sans-serif',
        size: 40,
        strokeColor: '#ffffff',
        strokeWidth: 4
      }),
      text: '生放送中です'
    }))
    scene.setTimeout(() => this.onEnd.fire(), 2000)
  }
}
