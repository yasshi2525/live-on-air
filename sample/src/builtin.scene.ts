import { GameMainParameterObject } from './parameterObject';
import { LiveOnAirScene, LiveOnAirSceneBuilder, Broadcaster, Spot, Field, Screen, Layer } from '@yasshi2525/live-on-air';

/* eslint no-unused-vars: 0 */
/* eslint @typescript-eslint/no-unused-vars: 0 */

/**
 * 新たに g.Scene を定義する場合の記述例です.
 *
 * @param param
 */
export const main = (param: GameMainParameterObject): void => {
  g.game.vars.gameState = { score: 0 };
  g.game.random = param.random;

  const scene: g.Scene & LiveOnAirScene = new LiveOnAirSceneBuilder(g.game).build();
  g.game.pushScene(scene);

  scene.onLoad.add(() => {
    // 各コンポーネントの参照
    const broadcaster: Broadcaster = scene.broadcaster;
    const spots: Spot[] = scene.spots;
    const field: Field = scene.field;
    const screen: Screen = scene.screen;
    const layer: Layer = scene.layer;
  });
};
