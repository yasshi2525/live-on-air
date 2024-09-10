# 新しく `g.Scene` を作成する

これからゲーム用の `g.Scene` を作成する場合、 `LiveOnAirSceneBuilder` を使います.

## 概要

`LiveOnAirSceneBuilder` の `build()` を呼び出すと、本ライブラリのコンポーネントが配置された `g.Scene` が作成されます.

```diff typescript
+ import {LiveOnAirScene, LiveOnAirSceneBuilder} from "@yasshi2525/live-on-air";
  export const main = (param: GameMainParameterObject) => {
    g.game.vars.gameState = { score: 0 }
    g.game.random = param.random
    
+   const scene: g.Scene & LiveOnAirScene = new LiveOnAirSceneBuilder(g.game).build()
    g.game.pushScene(scene)
}
```

## コンポーネントの取得

本ライブラリのコンポーネントは `LiveOnAirSceneBuilder` の `build()` の戻り値から取得可能です.

各コンポーネントは `g.Scene` の初期化後に利用可能です. 参照する際は必ず `onLoad()` の呼び出し後としてください.

```dieff typescript
- import {LiveOnAirScene, LiveOnAirSceneBuilder} from "@yasshi2525/live-on-air";
+ import {LiveOnAirScene, LiveOnAirSceneBuilder, Broadcaster, Spot, Field, Screen, Layer} from "@yasshi2525/live-on-air";
scene.onLoad.add(() => {
    // 各コンポーネントの参照
    const broadcaster: Broadcaster = scene.broadcaster
    const spots: Spot[] = scene.spots
    const field: Field = scene.field
    const screen: Screen = scene.screen
    const layer: Layer = scene.layer
})
```

各コンポーネントの役割は以下の通りです.

* `Broadcaster`: 放送者. プレイヤーが操作. 各訪問先を周り、生放送をする.
* `Spot`: 訪問先. 放送者が訪れると生放送イベントを始める.
* `Field`: マップ画面. 放送者が訪問先を巡回していく様子を制御する.
* `Screen`: 生放送画面. 生放送中のミニイベントの流れを制御する.
* `Layer`: 描画管理. 各要素を前後関係をつけて描画する.
