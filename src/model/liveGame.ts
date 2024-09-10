import { Live } from './live'
import { LiveContext } from './liveContext'

/**
 * ミニゲームを伴う生放送 ({@link Live}) の実装を支援するクラスです.
 *
 * プレイヤーがボタン押下すると結果が決まるようなミニゲームが対象です.
 *
 * 本クラスを継承したクラスを作り、抽象メソッドを実装してください.
 *
 * 本クラスは下記の流れでミニゲーム生放送を表現します.
 * ```
 * 生放送画面が開く
 *          ↓
 * 導入（ゲームルールの説明）
 *          ↓
 * ミニゲーム開始（ボタン出現）
 *          ↓
 * プレイヤーがボタンを押下する
 *          ↓
 * 成績の計算（100点満点）
 *          ↓
 * 成績に応じたゲーム結果の演出
 *          ↓
 * 生放送終了（マップに戻る）
 * ```
 *
 * @example
 * ```typescript
 * import { LiveGame } from '@yasshi2525/live-on-air'
 *
 * export class HogeLiveGame extends LiveGame {
 *    // 導入（ゲームルールの説明）の処理
 *    protected override handleIntroduction (context: LiveContext, next: () => void): void {
 *        // next() を実行すると次のステップに進みます。
 *        // 下記の例では2秒待機後次に進みます.
 *        context.scene.setTimeout(() => next(), 2000);
 *    }
 *    // ミニゲーム開始時の処理
 *    protected override handleGamePlay (context: LiveContext, next: () => void): void {
 *        // ...
 *    }
 *    // ...
 * }
 * ```
 */
export abstract class LiveGame implements Live {
  /**
   * ミニゲームの導入演出が終わり、ミニゲーム本編の開始直前に発火します.
   */
  readonly onIntroduce = new g.Trigger()
  /**
   * プレイヤーが操作し、成績が確定した直後に発火します.
   */
  readonly onSubmit = new g.Trigger<{
    /**
     * プレイヤーの成績（100点満点）
     */
    score: number,
    /**
     * 画面に表示する成績のテキスト
     * @see toResultText
     */
    text: string }>()

  /**
   * ミニゲームの結果演出が終わった直後に発火します.
   */
  readonly onResult = new g.Trigger()

  /**
   * ライブラリ利用者は本メソッドをオーバライドして実装する必要はありません.
   *
   * @param context 利用可能な環境情報
   * @param end 呼び出すと生放送が終了する関数
   */
  start (context: LiveContext, end: () => void) {
    const introCleanUp = this.handleIntroduction(context, () => {
      if (introCleanUp) {
        introCleanUp()
      }
      this.onIntroduce.fire()
      const gamePlayCleanUp = this.handleGamePlay(context)
      const submitCleanUp = this.handleSubmit(context, () => {
        const rawScore = this.evaluateScore(context)
        const score = Math.min(Math.max(rawScore, 0), 100)
        this.onSubmit.fire({ score, text: this.toResultText(context, score) })
        if (gamePlayCleanUp) {
          gamePlayCleanUp()
        }
        if (submitCleanUp) {
          submitCleanUp()
        }
        const resultCleanUp = this.handleResultViewing(context, score, () => {
          this.onResult.fire()
          if (resultCleanUp) {
            resultCleanUp()
          }
          end()
        })
      })
    })
  }

  /**
   * ゲームの導入画面を描画・演出します.
   *
   * 本メソッドを実装し、プレイヤーにゲームの概要を伝えてください.
   * 導入画面の演出が終了したら第2引数 `next()` を呼び出してください.
   *
   * プレイヤー操作後のクリーンアップ処理が必要な場合、クリーンアップ関数を戻り値に定義してください.
   *
   * @example
   * プレイヤーが説明を読む時間を確保するため、
   * 数秒待機してから `next()` を実行することをお勧めします
   * ```typescript
   * protected handleIntroduction (context: LiveContext, next: () => void): () => void {
   *    const scene = context.scene;
   *    const view = context.view; // 生放送用の描画エンティティのトップ要素
   *    // 画面に説明用の画像を表示します
   *    const description = new g.Sprite({ scene, src: <省略> });
   *    view.append(description);
   *    // 3秒間経過したら説明用画像の表示を終了します
   *    scene.setTimeout(() => {
   *      next(); // ゲーム進行のため、必ずこの行の命令を呼び出してください
   *    }, 3000);
   *    // 演出終了時に説明文を削除します.
   *    return () => {
   *      description.destroy();
   *    }
   * }
   * ```
   *
   * @param context 利用可能な環境情報
   * @param next 次のステップに進む際、呼び出すべき関数
   *
   * @protected
   */
  protected abstract handleIntroduction (context: LiveContext, next: () => void): (() => void) | void

  /**
   * ミニゲーム中の描画を行います.
   *
   * プレイヤー操作があると次のステップに進みます.
   *
   * ライブラリ利用者が本メソッドをオーバーライドしなかった場合、
   * 画面中央上にボタンが出現し、ボタンが押下されると次のステップに進みます.
   * プレイヤーの操作受付をデフォルト提供のボタン以外にしたい場合、
   * {@link handleSubmit} を継承したメソッドを定義してください.
   *
   * プレイヤー操作後のクリーンアップ処理が必要な場合、クリーンアップ関数を戻り値に定義してください.
   *
   * @example
   * 敵画像を表示し、プレイヤー操作があった際にクリーンアップ処理として敵画像を削除する例
   * ```typescript
   * protected handleGamePlay (context: LiveContext): () => void {
   *    const scene = context.scene;
   *    const view = context.view; // 生放送用の描画エンティティのトップ要素
   *    // 画面に敵画像を表示します
   *    const enemy = new g.Sprite({ scene, src: <省略> });
   *    // プレイヤー操作後に敵画像を削除します
   *    return () => {
   *      enemy.destroy();
   *    }
   * }
   * ```
   *
   * @param context 利用可能な環境情報
   *
   * @protected
   */
  protected abstract handleGamePlay (context: LiveContext): (() => void) | void

  /**
   * プレイヤー操作を受け付ける `touchable` なエンティティを定義します.
   *
   * デフォルト（メソッドを継承しなかった場合）では画面中央上に押下可能なボタンが出現します.
   *
   * 本メソッドを継承してエンティティを定義することで表示を差し替えられます.
   * エンティティを自身で定義する場合、操作検知 (`onPointDown` など) を実装してください.
   * また、ミニゲームを終了して次の結果発表ステップに進むタイミングで第2引数の `next()` を呼び出してください.
   *
   * もし、プレイヤー操作後にクリーンアップ処理が必要な場合、戻り値にクリーンアップ関数を定義してください.
   *
   * @example
   * protected override handleSubmit (context: LiveContext, next: () => void): () => void {
   *   const scene = context.scene;
   *   const view = context.view; // 生放送用の描画エンティティのトップ要素
   *   const button = new g.FilledRect({
   *      scene, parent: view, width: 100, height: 100, cssColor: 'red', touchable: true });
   *   // button が押下されたなら次のステップに進みます.
   *   button.onPointDown.addOnce(() => next());
   *   // ボタン押下後、クリーンアップ処理としてボタンを無効化させます.
   *   return () => {
   *      button.cssColor = 'gray';
   *      button.touchable = false;
   *      button.modified();
   *   }
   * }
   *
   * @param context 利用可能な環境情報
   * @param next 次のステップに進む際、呼び出すべき関数
   *
   * @protected
   */
  protected handleSubmit (context: LiveContext, next: () => void): (() => void) | void {
    const submit = new g.FilledRect({
      scene: context.scene,
      parent: context.container,
      x: context.container.width / 2,
      y: 150,
      width: 300,
      height: 200,
      anchorX: 0.5,
      anchorY: 0.5,
      cssColor: '#0044aa',
      touchable: true
    })
    submit.append(new g.Label({
      scene: context.scene,
      width: submit.width,
      y: submit.height / 2,
      text: 'PUSH!',
      textAlign: 'center',
      widthAutoAdjust: false,
      anchorY: 0.5,
      font: new g.DynamicFont({
        game: context.scene.game,
        fontFamily: 'sans-serif',
        fontColor: 'white',
        strokeColor: 'white',
        strokeWidth: 4,
        size: 50
      })
    }))
    submit.onPointDown.addOnce(() => next())
    return () => {
      submit.cssColor = '#444444'
      submit.touchable = false
      submit.modified()
    }
  }

  /**
   * ミニゲーム中の状態をもとにプレイヤーの成績を100点満点で採点します.
   *
   * 本メソッドは {@link handleSubmit} で `end()` が呼ばれた際呼び出され、
   * 戻り値の値を成績として評価します.
   *
   * ミニゲーム中の採点の根拠となる情報は `context`、
   * 特に自由に定義可能な {@link LiveContext#vars} に格納して、
   * 採点処理を実装してください.
   *
   * @example
   * 増減するゲージの値が最大のタイミングを狙ってプレイヤーがボタンを押下するミニゲームの場合
   * const maxWidth = 500;
   * protected handleGamePlay (context: LiveContext, next: () => void): () => void {
   *    // ゲージを作成
   *    const gauge = new g.FilledRect({
   *      scene: context.scene, parent: context.view, width: 0, cssColor: 'red' });
   *    // 自由に定義可能なフィールドにゲージのエンティティを追加
   *    context.vars = { gauge };
   *    gauge.onUpdate.add(() => {
   *        gauge.width++
   *        gauge.modified();
   *    }).
   *    // ...
   * }
   * protected evaluateScore (context: LiveContext): number {
   *   // ゲージエンティティを取得
   *   const gauge = (context.vars as Record<string, g.FilledRect>).gauge;
   *   // ゲージの幅の大きさに比例した成績を100点満点で採点結果として返す.
   *   return gauge.width / maxWidth * 100;
   * }
   *
   * @param context 利用可能な環境情報
   *
   * @protected
   */
  protected abstract evaluateScore (context: LiveContext): number

  /**
   * プレイヤーの成績に応じて画面に表示するテキストを定義します.
   *
   * ライブラリ利用者が本メソッドをオーバライドしない場合、
   * 下記の文字列がラベルとして生放送画面に出力されます.
   *
   * 1. 95点以上: `エクセレント！`
   * 2. 75点以上: `グレイト！`
   * 3. 50点以上: `グッド！`
   * 4. 50点未満: `ミス…`
   *
   * @param context 利用可能な環境情報
   * @param score プレイヤーの成績（100点満点）
   *
   * @protected
   */
  protected toResultText (context: LiveContext, score: number): string {
    const scoreBoard: [number, string][] = [
      [95, 'エクセレント！'],
      [75, 'グレイト！'],
      [50, 'グッド！'],
      [0, 'ミス…']
    ]
    for (const [border, text] of scoreBoard) {
      if (score >= border) {
        return text
      }
    }
    // 通常未到達
    // istanbul ignore next
    return '？？？'
  }

  /**
   * プレイヤーの成績発表描画を表示します.
   *
   * ライブラリ利用者が本メソッドをオーバライドしなかった場合、
   * プレイヤーの成績に応じたラベルが3秒間表示されます.
   *
   * プレイヤーの成績は 第2引数 `score` に100点満点で格納されています.
   * 成績に応じた画面に表示する文字列は {@link toResultText} を呼び出すことで取得できます.
   *
   * 演出が終了したら、第2引数 `next()` を呼び出してください.
   *
   * 演出終了時、描画したエンティティを削除するようなクリーンアップ処理を定義したい場合、
   * 戻り値にクリーンアップ処理を記述した関数を指定してください.
   *
   *
   * @example
   * ```typescript
   * protected override handleResultViewing (context: LiveContext, score: number, next: () => void): () => void {
   *    // 成績に応じたラベルを表示
   *    const result = new g.Label({ scene: context.scene, parent: context.view, font: <省略>,
   *      text: this.toResultText(context, score) });
   *    // 5秒間表示して次のステップに移動する
   *    context.scene.setTimeout(() => next(), 5000);
   *    // 次のステップに移動する直前にクリーンアップとしてラベルを削除する
   *    return () => {
   *      result.destroy();
   *    }
   * }
   * ```
   *
   * @param context 利用可能な環境情報
   * @param score プレイヤーの成績（100点満点）
   * @param next 呼び出すと次のステップに進む関数
   *
   * @protected
   */
  protected handleResultViewing (context: LiveContext, score: number, next: () => void): (() => void) | void {
    const result = new g.Label({
      scene: context.scene,
      parent: context.container,
      width: context.container.width,
      widthAutoAdjust: false,
      textAlign: 'center',
      y: context.container.height / 2,
      anchorY: 0.5,
      font: new g.DynamicFont({
        game: context.scene.game,
        fontFamily: 'sans-serif',
        fontColor: 'white',
        size: 75,
        strokeColor: 'black',
        strokeWidth: 5
      }),
      text: this.toResultText(context, score)
    })
    context.scene.setTimeout(() => next(), 3000)
    return () => {
      result.destroy()
    }
  }
}
