import {GameMainParameterObject} from "./parameterObject";
import {Broadcaster, BroadcasterBuilder, Field, FieldBuilder, Layer, LayerBuilder, Screen, ScreenBuilder, Spot, SpotBuilder} from "@yasshi2525/live-on-air";

/**
 * 自身で g.Scene を用意してい場合の Spot の作成の仕方です.
 *
 * @param param
 */
export const main = (param: GameMainParameterObject) => {
  g.game.vars.gameState = { score: 0 }
  g.game.random = param.random

  // 自身で実装している g.Scene
  const scene = new g.Scene({ game: g.game })
  scene.onLoad.add(() => {
    // 既存の g.Scene の初期化処理
    // 以下から本ライブラリの初期化処理です
    const layer: Layer = new LayerBuilder(scene).build()
    const field: Field = new FieldBuilder().build()
    field.container = layer.field
    const screen: Screen = new ScreenBuilder(scene).build()
    screen.container = layer.screen
    const broadcaster:Broadcaster = new BroadcasterBuilder(scene).build()
    broadcaster.standOn(field)
    const builder = new SpotBuilder(scene)
    builder.location({ x: 100, y: 150 })
    // 定義情報の取得
    // = { x: 100, y: 150 }
    console.log(builder.location())
    const spot1: Spot = builder.build()
    spot1.deployOn(field)
    spot1.attach(screen)
    const spot2: Spot = builder
      .location({ x: 500, y: 350 })
      .build()
    field.addSpot(spot2)
    screen.addSpot(spot2)
  })
  g.game.pushScene(scene)
}
