import { LiveOnAirSceneBuilder } from '@yasshi2525/live-on-air';
import { GameMainParameterObject } from './parameterObject';

/**
 * 組み込みの g.Scene を使って スポットに用いる画像を変更する例です.
 *
 * @param param
 */
export const main = (param: GameMainParameterObject): void => {
  g.game.vars.gameState = { score: 0 };
  g.game.random = param.random;
  LiveOnAirSceneBuilder.getDefault(g.game)
    .spot({
      locked: g.game.asset.getImageById('spot.custom.locked'),
      unvisited: g.game.asset.getImageById('spot.custom.unvisited'),
      normal: g.game.asset.getImageById('spot.custom.normal'),
      disabled: g.game.asset.getImageById('spot.custom.disabled')
    });
  const scene = new LiveOnAirSceneBuilder(g.game)
    .spot({ x: 100, y: 150 })
    .build();
  g.game.pushScene(scene);
};
