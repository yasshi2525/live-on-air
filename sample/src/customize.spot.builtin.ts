import { LiveOnAirSceneBuilder } from '@yasshi2525/live-on-air';
import { GameMainParameterObject } from './parameterObject';

/**
 * 組み込みの g.Scene を使って スポットに用いる画像を変更する例です.
 *
 * @param param
 */
export const main = (param: GameMainParameterObject): void => {
  g.game.random = param.random;
  const scene = new LiveOnAirSceneBuilder(g.game)
    .spot({
      x: 100,
      y: 150,
      locked: g.game.asset.getImageById('spot.custom.locked'),
      unvisited: g.game.asset.getImageById('spot.custom.unvisited'),
      normal: g.game.asset.getImageById('spot.custom.normal'),
      disabled: g.game.asset.getImageById('spot.custom.disabled')
    })
    .spot({ x: 500, y: 350 })
    .build();
  g.game.pushScene(scene);
};
