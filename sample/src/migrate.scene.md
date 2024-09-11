# 自身で定義した `g.Scene` に組み込む

すでに自分でゲーム用の `g.Scene` を定義している場合の本ライブラリの組み込み方を説明します.

描画内容の制御を自分で用意するか、本ライブラリ提供のものを利用するかで少し手順が変わります.
本ライブラリ提供のものを利用するとエンティティ間の前後関係などは自動で制御されますが、本ライブラリ以外に描画するエンティティが多種ある場合や、独自のレイアウト機構を持つ場合、干渉する可能性があります.
自分で用意する場合は **「独自レイアウトの場合」** の注意書きに沿って構築してください.

## 概要
 
自身の `g.Scene` の `onLoad()` の呼び出し箇所に以下を追記してください.

以降で内容を説明します.

```diff typescript
+ import {Broadcaster, BroadcasterBuilder, Field, FieldBuilder, Layer, LayerBuilder, Screen, ScreenBuilder, Spot, SpotBuilder} from "@yasshi2525/live-on-air";
  
  export const main = (param: GameMainParameterObject) => {
    // 自身で実装している g.Scene
    const scene = new g.Scene({game: g.game})
    scene.onLoad.add(() => {
      // 既存の g.Scene の初期化処理
+     // 以下から本ライブラリの初期化処理です
+     const layer: Layer = new LayerBuilder(scene).build()
+     const field = new FieldBuilder().build()
+     field.container = layer.field
+     const screen = new ScreenBuilder(scene).build()
+     screen.container = layer.screen
+     const broadcaster = new BroadcasterBuilder(scene).build()
+     broadcaster.standOn(field)
+     const spot = new SpotBuilder(scene).build()
+     spot.deployOn(field)
+     spot.attach(screen)
    })
    g.game.pushScene(scene)
  }
```

> [!NOTE]
> 独自レイアウトの場合、 `Layer` は不要なので初期化・設定処理を削除してください.
> ```diff typescript
> - import {Broadcaster, BroadcasterBuilder, Field, FieldBuilder, Layer, LayerBuilder, Screen, ScreenBuilder, Spot, SpotBuilder} from "@yasshi2525/live-on-air";
> + import {Broadcaster, BroadcasterBuilder, Field, FieldBuilder, Screen, ScreenBuilder, Spot, SpotBuilder} from "@yasshi2525/live-on-air";
>   // ...
>     // 以下から本ライブラリの初期化処理です
> -   const layer: Layer = new LayerBuilder(scene).build()
>     const field = new FieldBuilder().build()
> -   field.container = layer.field
>     const screen = new ScreenBuilder(scene).build()
> -   screen.container = layer.screen
>     const broadcaster = new BroadcasterBuilder(scene).build()
>     broadcaster.standOn(field)
>     const spot = new SpotBuilder(scene).build()
>     spot.deployOn(field)
>     spot.attach(screen)
>   })
>   // ...
> ```

## `Layer` (本ライブラリの描画コンポーネント) の初期化

> [!NOTE]
> 独自レイアウトの場合、 `Layer` は不要です. 次の手順に進んでください.

まず、 `Layer` を初期化します.
`Layer` は本ライブラリが提供するコンポーネントの前面・背面を設定します.
Layer を作成しないとゲーム画面上に描画されない点にご注意ください.

`Layer` は `LayerBuilder` の `build()` を使用して作成してください.

```typescript
import { Layer, LayerBuilder } from '@yasshi2525/live-on-air'
const layer: Layer = new LayerBuilder(scene).build()
```

## `Field` と `Screen` (マップ画面、放送画面の制御コンポーネント)の初期化

次に `Field` と `Screen` を初期化します.
`Field` は放送者が訪問先を巡回していく画面を制御します.
`Screen` は訪問先で生放送する画面を制御します.

この後説明する `Broadcaster`, `Spot` はこれらに登録しないと
ゲームが進行できない点にご注意ください.

`Field`, `Screen` は `FieldBuilder`, `ScreenBuilder` の `build()` を使用して作成してください.

```typescript
import { Field, FieldBuilder, Screen, ScreenBuilder } from '@yasshi2525/live-on-air'
const field = new FieldBuilder().build()
const screen = new ScreenBuilder(scene).build()
```

そして `Field`, `Screen` をゲーム画面上に描画するために、 `Layer` のフィールドと紐づけます.
`Field`, `Screen` の `container` フィールドに各コンポーネントが描画されます.
これを対応する `Layer` の `field`, `screen` フィールドとしてください.

```diff typescript
  const field = new FieldBuilder().build()
+ field.container = layer.field
  const screen = new ScreenBuilder(scene).build()
+ screen.container = layer.screen
```

> [!NOTE]
> 独自レイアウトの場合、 `Field` `Screen` の `container` フィールドを自身で定義したエンティティにしてください.
> 
> 例:
> ```diff typescript
>   const field = new FieldBuilder().build()
> - field.container = layer.field
> + field.container = <自身で定義した、マップ描画用エンティティ>
>   const screen = new ScreenBuilder(scene).build()
> - screen.container = layer.screen
> + screen.container = <自身で定義した、生放送描画用エンティティ>
> ```

## `Broadcaster`, `Spot` (放送者、訪問先のコンポーネント)の初期化

最後に `Broadcaster` と `Spot` を初期化します. 
`Broadcaster` は放送者を、 `Spot` は訪問先を表します.

`Broadcaster`, `Spot` は `BroadcasterBuilder`, `SpotBuilder` の `build()` を使用して作成してください.

```typescript
import { Broadcaster, BroadcasterBuilder, Spot, SpotBuilder } from '@yasshi2525/live-on-air'
const broadcaster = new BroadcasterBuilder(scene).build()
const spot = new SpotBuilder(scene).build()
```

どちらも `Field` に登録しないと機能しません.

```diff typescript
  const broadcaster = new BroadcasterBuilder(scene).build()
+ broadcaster.standOn(field)
  const spot = new SpotBuilder(scene).build()
+ spot.deployOn(field)
```

`Sopt` はさらに `Screen` にも登録しないと機能しません.

```diff typescript
  const broadcaster = new BroadcasterBuilder(scene).build()
  broadcaster.standOn(field)
  const spot = new SpotBuilder(scene).build()
  spot.deployOn(field)
+ spot.attach(screen)
```

以上がすでに存在する `g.Scene` に本ライブラリを組み込む手順です.

上記を実行すると下記のような画面が出力されます.

![ゲーム画面](migrate.scene.1.png)
