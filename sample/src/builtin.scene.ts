import { GameMainParameterObject } from './parameterObject';
import { LiveOnAirScene, LiveOnAirSceneBuilder, Broadcaster, Spot, Field, Screen, CommentContext, CommentSupplier, CommentDeployer, Scorer, Ticker, Layer } from '@yasshi2525/live-on-air';

/* eslint no-unused-vars: 0 */
/* eslint @typescript-eslint/no-unused-vars: 0 */

/**
 * 新たに g.Scene を定義する場合の記述例です.
 *
 * @param param
 */
export const main = (param: GameMainParameterObject): void => {
  g.game.random = param.random;

  const scene: g.Scene & LiveOnAirScene = new LiveOnAirSceneBuilder(g.game).build();
  g.game.pushScene(scene);

  scene.onLoad.add(() => {
    // 各コンポーネントの参照
    const broadcaster: Broadcaster = scene.broadcaster;
    const spots: Spot[] = scene.spots;
    const field: Field = scene.field;
    const screen: Screen = scene.screen;
    const commentContext: CommentContext = scene.commentContext;
    const commentSupplier: CommentSupplier = scene.commentSupplier;
    const commentDeployer: CommentDeployer = scene.commentDeployer;
    const scorer: Scorer = scene.scorer;
    const ticker: Ticker = scene.ticker;
    const layer: Layer = scene.layer;
  });
};
