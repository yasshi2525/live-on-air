import { GameMainParameterObject } from './parameterObject';
import { Broadcaster, BroadcasterBuilder, Field, FieldBuilder, Layer, LayerBuilder, Screen, ScreenBuilder, Spot, SpotBuilder } from '@yasshi2525/live-on-air';

/**
 * 自身で g.Scene を用意してい場合の Spot の画像の変更の仕方です.
 *
 * @param param
 */
export const main = (param: GameMainParameterObject): void => {
  g.game.vars.gameState = { score: 0 };
  g.game.random = param.random;

  // 自身で実装している g.Scene
  const scene = new g.Scene({ game: g.game });
  scene.onLoad.add(() => {
    // 既存の g.Scene の初期化処理
    // 以下から本ライブラリの初期化処理です
    const layer: Layer = new LayerBuilder(scene).build();
    const field: Field = new FieldBuilder().build();
    field.container = layer.field;
    const screen: Screen = new ScreenBuilder(scene).build();
    screen.container = layer.screen;
    const broadcaster:Broadcaster = new BroadcasterBuilder(scene).build();
    broadcaster.standOn(field);
    SpotBuilder.getDefault(scene)
      .image({
        locked: scene.asset.getImageById('spot.custom.locked'),
        unvisited: scene.asset.getImageById('spot.custom.unvisited'),
        normal: scene.asset.getImageById('spot.custom.normal'),
        disabled: scene.asset.getImageById('spot.custom.disabled')
      });
    const builder = new SpotBuilder(scene);
    const spot1: Spot = builder
      .location({ x: 100, y: 150 })
      .build();
    spot1.deployOn(field);
    spot1.attach(screen);
    const spot2: Spot = builder
      .location({ x: 500, y: 350 })
      .build();
    field.addSpot(spot2);
    screen.addSpot(spot2);
  });
  g.game.pushScene(scene);
};
