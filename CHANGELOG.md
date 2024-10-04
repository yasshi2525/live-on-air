# 更新履歴 Change Log

## v1.0.1

Bug:

* Akashic Engine 非推奨の ES6以降の構文を削除 #76

## v1.0.0

Feature:

* Scorer に refrainsSendingScore を追加 #71
* Broadcaster に onDepart, onStop を 追加 #72

## v1.0.0-alpha.4

Feature:

* Broadcaster の onLiveEnd トリガに引数 Live を追加 #69

## v1.0.0-alpha.3

Features:

* LiveContext の初期値設定機能 #66
* CommentContext にフィールド追加 #67

## v1.0.0-alpha.2

Features:

* CommentContext vars を初期化時に設定可能に #63

Bug Fixes:

* CommentContextSupplier の vars の初期値が登録されない #60
* CommentSupplier が同じコメントを返し続ける #61
* CommentSupplier の候補コメントがない状態が2回続くと無限ループする #62
* LiveOnAirSceneConfigure の引数定義に誤り #64

## v1.0.0-alpha.1

Features:

* Screen に onLiveStart トリガを追加 #55
* vars フィールドを Builder 使用時に指定可能に #56
* unlock 処理を Screen 内で実施 #57
* Spot の名称表示機能追加 #58

## v1.0.0-alpha.0

公開
