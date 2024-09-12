import { GameMainParameterObject } from './parameterObject';
import { Broadcaster, BroadcasterBuilder, Field, FieldBuilder, Layer, LayerBuilder, Screen, ScreenBuilder, Spot, SpotBuilder } from '@yasshi2525/live-on-air';

/**
 * 自身で実装している g.Scene に本ライブラリを組み込む記述例です.
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
    const screen:Screen = new ScreenBuilder(scene).build();
    screen.container = layer.screen;
    const broadcaster:Broadcaster = new BroadcasterBuilder(scene).build();
    broadcaster.standOn(field);
    const spot:Spot = new SpotBuilder(scene).build();
    spot.deployOn(field);
    spot.attach(screen);
  });
  g.game.pushScene(scene);
};
