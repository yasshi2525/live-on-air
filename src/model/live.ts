import { LiveContext } from './liveContext'

/**
 * {@link Spot} を訪れると開始する生放送を制御します.
 *
 * 独自の生放送コンテンツを追加するためには、本インタフェースを実装したクラスを作成する必要があります.
 * なお、引数なしのコンストラクタを定義する必要がある点に留意してください.
 */
export interface Live {
  /**
   * ライブラリ利用者が自由に使えるフィールドです.
   */
  vars?: unknown

  /**
   * 生放送中の処理を実行します.
   *
   * {@link Broadcaster} が {@link Spot} に到着すると呼び出されます.
   * 第2引数の `end()` が呼び出されると放送を終了します.
   *
   * @param context 放送中に利用可能な情報が格納されています.
   * @param end 放送を終了させてよいタイミングになった際、関数を呼び出してください.
   *
   * @example
   * 画像を2秒間表示した後、放送を終了します.
   * ```typescript
   * start (context: LiveContext, end: () => void): void {
   *    const scene: g.Scene = context.scene;
   *    const view: g.E = context.view; // 生放送用の描画エンティティ
   *    view.append(new g.Sprite({ scene, src: <省略> } ));
   *    scene.setTimeout(() => end(), 2000);
   * }
   * ```
   */
  start (context: LiveContext, end: () => void): void
}

/**
 * サンプル表示用の生放送です.
 */
export class SampleLive implements Live {
  vars?: unknown
  start ({ scene, view } : LiveContext, end: () => void): void {
    const bg = new g.FilledRect({
      scene,
      parent: view,
      width: view.width,
      height: view.height,
      cssColor: '#ffffaa',
      opacity: 0.5
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
      text: '生放送中です',
      textAlign: 'center',
      widthAutoAdjust: false,
      width: bg.width,
      y: bg.height / 2,
      anchorY: 0.5
    }))
    // 2秒経過したら放送を終了します.
    scene.setTimeout(() => end(), 2000)
  }
}
