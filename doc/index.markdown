---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

layout: home
title: ミニゲーム集向けゲームテンプレート Live on Air
---

本ライブラリは「複数のミニゲームから構成されるようなゲームの開発」を支援する、[Akashic Engine](https://akashic-games.github.io/)の拡張ライブラリです.
[ニコ生ゲーム](https://site.live.nicovideo.jp/ichiba.html)のランキングゲームとして投稿できるように作られています.

## コンセプト

### 本ライブラリで構築できるゲーム

プレイヤーが次々とミニゲームをクリアして得点を稼ぐシングルプレイゲームの開発を支援します.

ミニゲームの選択、ミニゲームの起動・終了といったゲームの周辺処理の実装に時間を割かなくて済むよう、
ゲーム開発者がミニゲームの開発に専念できるゲームテンプレートを提供します.

また、[ニコニコ生放送](https://live.nicovideo.jp/)を模したコメントをゲーム演出として流すことで、生放送を舞台にしたゲーム構築を支援します. (表示されるコメントはプログラムが出力するものです)

「ミニゲーム集」✕「生放送」をコンセプトにした下記のようなゲームが作りやすくなります.

* 難易度が次第に上がっていく、ステージ式の詰め将棋のようなパズルゲーム
* ある生主の放送あるあるやおなじみの内容をゲーム化したイベント向きゲーム
* リアル開催の中～大規模イベントの会場紹介向け、企画体験型ゲーム

※ 本ライブラリはニコ生ゲーム[今日から私も外配信者♪](https://commons.nicovideo.jp/works/lg1850)（[あかねこ。](https://x.com/akaneko0226)プロデュース）のゲーム設計をもとに、プラットフォーム部分を再利用可能な形にしたものです.

### 想定する利用者

* JavaScript, Typescript の言語経験がある、または、勉強中である.
* ニコ生ゲームを制作したことがある、または、Akashic Engineの基礎知識がある.
* 作ってみたいミニゲームのアイデアがある

### 提供機能

* 二次元マップ上を移動するプレイヤー（放送者）
* 二次元マップ上に配置できるスポット（訪問先）
* 前提スポットをクリアすることによって解放されるロック機能
* ユーザがスポットを選択することでプレイヤーが移動し、到達後にミニゲームが起動する機能
* ミニゲーム実行用の画面フレーム
* ミニゲーム構築支援フレームワーク
* ニコニコ生放送を模したコメント表示システム
* 得点計算・表示
* 残り時間表示

以下は利用者自身で実装・定義する必要があります.

* 背景、プレイヤー、訪問スポットの画像 (サンプル画像あり)
* ミニゲームのコンテンツ部分 (サンプルゲームあり)
* 表示されるコメント内容 (サンプルコメントあり)

## インストール方法
Akashic Engineプロジェクトにて下記コマンドを実行してください.

```shell
akashic install @yasshi2525/live-on-air
```

## チュートリアル

* [使ってみる](sample/getting.started.html)

## ガイド

* [新しくg.Sceneを作成する](sample/builtin.scene.html)  
* [自身で定義したg.Sceneに組み込む](sample/migrate.scene.html)

* [訪問先を追加する](sample/add.spot.html)  
* [訪問先の画像を変更する](sample/customize.spot.html)

* [API 仕様書](jsdoc)

## ライブラリ開発者向け

* [coverage](coverage/lcov-report)

## 連絡先

やっしー (yasshi2525) [X](https://x.com/yasshi2525)
