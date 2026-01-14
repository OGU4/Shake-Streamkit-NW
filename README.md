日本語 | [English](README-en.md)

# Shake StreamKit

Shake StreamKit は、Splatoon 3 のサーモンラン NEXT WAVE テレメトリを WebSocket で受信し、配信画面に重ねるブラウザ用オーバーレイです。OBS のブラウザソースや通常のブラウザで動作します。

## できること

- リアルタイムのWave/残り時間/イクラ状況/プレイヤーステータス表示
- Wave終了やノルマ達成時の自動表示・自動非表示
- WebSocket接続ログ/通知の表示
- 音声アラート（Wave開始、20秒警告、オオモノ湧き予告、EX Wave(Joe)カウントダウンなど）
- Script機能（残り秒数に応じた読み上げ）と専用エディタ
- 13言語対応のUI

## 必要環境

- Node.js 18+（20 LTS推奨）
- Git LFS（アイコン画像の取得に必要）

## セットアップ

```bash
git lfs install

git clone https://github.com/OGU4/Shake-Streamkit-NW
cd Shake-Streamkit-NW
npm install
```

## 起動

```bash
npm start
```

`http://localhost:5173/` にアクセスします。

### 本番ビルド

```bash
npm run build
npm run preview
```

- 出力は `dist/`。
- `vite.config.ts` の `base` は `/shake-streamkit/` です。公開パスが違う場合は修正してください。

## 使い方

### 1) WebSocket / ファイル入力
- Settings -> Data Source
  - Server Address は `host[:port]`（スキームなし）
  - 既定は `.env` の `VITE_WS_SERVER=localhost:4649`
  - File Input は NDJSON（1行1イベント）の `.json` を受け付け
  - Simulation を有効にすると 0.5x〜10x で再生

### 2) オーバーレイ挙動
- Settings -> General / Advanced
  - ノルマ達成/ Wave終了で自動表示
  - 自動非表示の時間調整
  - プレイヤーステータス表示、色固定、アニメーション抑制

### 3) Script機能（読み上げ）
- Settings -> Script で有効化
- Edit ボタンで `/script-editor` を開く
- 1行1ルールの形式:
  - `残り秒数 テキスト`
  - 例: `20 20秒です`
- Wave 1〜5、5セットに対応
- 日本語音声（Web Speech API）が使えるブラウザのみ読み上げ可

### 4) 音声アラート
- Settings -> Advanced
  - Wave開始アナウンス
  - 20秒警告
  - オオモノ湧き予告（カウントダウン）
  - EX Wave(Joe) カウントダウン/ターゲット切替

## 環境変数 / HTTPS

`.env` / `.env.local`:

```env
VITE_WS_SERVER=localhost:4649
SERVER_SSLCERT=.dev/ssl/localhost.crt
SERVER_SSLKEY=.dev/ssl/localhost.key
```

- `scripts/ssl_mac.sh` / `scripts/ssl_win.bat` でローカル証明書を生成できます。
- HTTPSで起動する場合:
  - `npm start -- --https`

## ローカライズ

- 翻訳ファイル: `public/locales/`
- 言語一覧: `Shake-Streamkit-NW/modules/core/utils/language.ts`

## テスト

```bash
npm test
```

## ライセンス

GPL-3.0-only (`LICENSE` を参照)

## 関連

- ShakeScouter: https://github.com/mntone/ShakeScouter
