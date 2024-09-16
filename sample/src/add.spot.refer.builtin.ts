import { LiveOnAirSceneBuilder } from '@yasshi2525/live-on-air';
import { GameMainParameterObject } from './parameterObject';

/**
 * 組み込みの g.Scene を使って スポットを定義する例です.
 *
 * @param param
 */
export const main = (param: GameMainParameterObject): void => {
  g.game.random = param.random;
  const builder = new LiveOnAirSceneBuilder(g.game)
    .spot({ x: 100, y: 150 })
    .spot({ x: 500, y: 350 });
  // 定義情報の取得
  // = [{ x: 100, y: 150, ... }, { x: 500, y: 350, ... }]
  console.log(builder.spot());
  const scene = builder.build();
  g.game.pushScene(scene);
};
