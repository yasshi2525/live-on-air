import { GameMainParameterObject } from './parameterObject';
import { LiveOnAirSceneBuilder } from '@yasshi2525/live-on-air';

/**
 * ニコ生ゲーム(ランキングゲーム)における main.ts の記述例です.
 *
 * @param param
 */
export const main = (param: GameMainParameterObject): void => {
  g.game.random = param.random;

  const scene = new LiveOnAirSceneBuilder(g.game)
    .spot({ x: 300, y: 0 })
    .spot({ x: 500, y: 0 })
    .spot({ x: 700, y: 0 })
    .spot({ x: 900, y: 0 })
    .build();

  g.game.pushScene(scene);
};
