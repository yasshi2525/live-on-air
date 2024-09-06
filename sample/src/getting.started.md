# 使ってみる

## Akashic Engine プロジェクトを構築する

Akashic Engine の公式ページを参考にプロジェクトを作成してください.  

## live-on-air のインストール

プロジェクトルートフォルダ (`game.json` のある場所) をカレントディレクトリとして、以下のコマンドを実行してください.

```shell
npx akashic install @yasshi2525/live-on-air
```

> [!NOTE]
> `@akashic/akashic-cli` をグローバルインストールしている環境ならば
> `npx` の記述は不要です

コマンドを実行すると `game.json` に以下の記述が追加されます.  

> [!NOTE]
> 追加される技術はどれもゲーム構築時には使わないものなので、
> 確認しなくとも問題ありません.

* 画像アセットファイル
* ライブラリコード

> [!TIP]
> 画像アセットファイルは特に画像アセットをカスタマイズしなかったとき、
> デフォルトで使用されるものです.  
> live-on-air は画像ファイルも提供するので、
> 自身で画像を用意しなくとも、すぐにゲームを構築できます.

```json5
{
  "assets": {
    // 画像アセットファイル
    "node_modules/@yasshi2525/live-on-air/image/default.png": {
      "type": "image",
      "path": "node_modules/@yasshi2525/live-on-air/image/default.png",
      "width": 181,
      "height": 96,
      "global": true
    },
    // ...
    "globalScripts": [
      // ライブラリコード
      "node_modules/@yasshi2525/live-on-air/lib/index.js",
      // ...
    ],
    "moduleMainScripts": {
      // ライブラリコード
      "@yasshi2525/live-on-air": "node_modules/@yasshi2525/live-on-air/lib/index.js",
      // ...
    }
  }
}
```

> [!NOTE]
> 上記は記載例です. 細かなパスや値は変わることがあります.
> また Akashic Engine の仕様変更により、追加項目が変わる可能性があります.

## (補足) アップデート方法

再インストールすることで最新版がインストールされます.

```shell
npx akashic uninstall @yasshi2525/live-on-air
npx akashic install @yasshi2525/live-on-air
```

## (補足) アンインストール方法

下記コマンドを実行することでライブラリは削除され、 `game.json` も元の記述に戻ります.

```shell
npx akashic uninstall @yasshi2525/live-on-air
```
