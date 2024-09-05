import { GameMainParameterObject } from './parameterObject'
import { SceneBuilder } from '@yasshi2525/live-on-air'

/**
 * ニコ生ゲーム(ランキングゲーム)における main.ts の記述例です.
 *
 * @param param
 */
export const main = (param: GameMainParameterObject) => {
  g.game.vars.gameState = { score: 0 }
  g.game.random = param.random

  const scene = new SceneBuilder(g.game)
    .spot({ x: 200, y: 0 })
    .spot({ x: 400, y: 0 })
    .spot({ x: 600, y: 0 })
    .spot({ x: 800, y: 0 })
    .build()

  g.game.pushScene(scene)
}
