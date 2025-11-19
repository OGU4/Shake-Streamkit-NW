## shake-streamkit — Unofficial Practical Guide (auto-generated from source)

### 1. プロジェクト概要
- ShakeStreamKit は ShakeScouter が配信するサーモンラン NEXT WAVE テレメトリをブラウザ／OBS ブラウザソース上に重ねる React + Redux 製フロントエンドです。エントリポイントは `Shake-Streamkit-NW/index.tsx:1-40` と `Shake-Streamkit-NW/app/App.tsx:3-22` で、環境検出 → WebSocket サブスクライブ → 多言語ロード → Redux Provider を包んだ App コンテナを構築しています。
- 画面は OverlayHost（オーバーレイ描画・カメラプレビュー・Powered by 表示）、OverlayController（試合／Wave 切替と WebSocket 状態表示）、SettingsWindow（Radix UI ダイアログで設定タブ群）で構成されています。`App` では通知コントローラも常駐し、接続イベントをトースト表示します。
- Redux ストアは設定・オーバーレイ・通知ログ・テレメトリ slice を束ね、overlay Middleware で自動表示／隠蔽制御、通知 Middleware でログの自動クリーンアップを行います(`Shake-Streamkit-NW/app/store.ts:1-40`)。

#### ディレクトリ構成（抜粋）
- `Shake-Streamkit-NW/index.tsx` — React エントリポイント。PersistGate／EnvironmentProvider／WebSocketProvider を束ねています。
- `Shake-Streamkit-NW/app/` — `App.tsx`, `store.ts`, Redux hooks などアプリケーションシェル。
- `Shake-Streamkit-NW/modules/core/` — IntlLoader, EnvironmentProvider, 共通 hooks/utils。
- `Shake-Streamkit-NW/modules/overlay/` — OverlayHost, OverlayController, Match/Wave selector, middleware。
- `Shake-Streamkit-NW/modules/settings/` — Radix UI ベースの設定ダイアログ、ページ別ロジック。
- `Shake-Streamkit-NW/modules/telemetry/` — WebSocket hooks、シミュレーター、models/slicers。
- `Shake-Streamkit-NW/modules/notification/` — NotificationController と関連 slice。
- `Shake-Streamkit-NW/voices/` — ブラウザ再生用の音声ファイル群（例: ずんだボイス）。
- `types/` — 型定義の補助ファイル。`tsconfig.json` の include で参照されます。
- `public/locales/` — IntlLoader が読み込む JSON 辞書。新言語を追加する際はここにファイルを置きます。

### 2. 必要環境
- Node.js 18 以上、推奨は Node.js 20 LTS（Vite 5.2.13 の engines 要件参照 `package-lock.json:8469-8488`）。npm は Node 付属版で問題ありません。nvm / fnm などのバージョンマネージャ使用を推奨します。
- Git LFS をセットアップしないと LFS 管理のアイコン類を取得できません(`.gitattributes:1-2`)。`git lfs install` 後に clone してください。
- TypeScript / Vite 設定では `@/*` が `Shake-Streamkit-NW/modules/*`、`@/voices/*` が `Shake-Streamkit-NW/voices/*` に解決されます(`tsconfig.json:11-40`, `vite.config.ts:22-32`)。IDE でパスエイリアスに対応させてください。
- `.env`（および `.env.local`）で `VITE_WS_SERVER` と Vite Dev Server の TLS 証明書パス (`SERVER_SSLCERT`,`SERVER_SSLKEY`) を指定します。デフォルトは `localhost:4649` です(`.env:1`、`vite.config.ts:13-59`)。OBS 等で https が必要な場合は後述の SSL スクリプトを使います。

### 3. インストール手順
1. Clone（LFS 有効）  
   ```bash
   git lfs clone https://github.com/mntone/shake-streamkit.git
   cd shake-streamkit
   ```
2. 依存パッケージを取得  
   ```bash
   npm install
   ```
3. 環境変数を整備  
   - `.env` に `VITE_WS_SERVER=<host[:port]>` を書き、必要なら `.env.local` で上書き。
   - HTTPS が欲しい場合は `bash scripts/ssl_mac.sh` もしくは `scripts\ssl_win.bat` を実行し、ローカル証明書と `.env.local` を自動生成します（`scripts/ssl_mac.sh:1-39`、`scripts/ssl_win.bat:1-51`）。

### 4. 開発サーバの起動方法
- `npm start` は `vite` を直接実行します(`package.json:64-69`)。デフォルトで `http://localhost:5173/` にホストされ、ビルド成果物は `/shake-streamkit/` ベースを期待します(`vite.config.ts:18-54`)。別ポートにしたい場合は `npm start -- --port 5174` のように Vite 引数を渡します。
- 起動すると `/Shake-Streamkit-NW/index.tsx` で Redux Persist のロード完了を待ってから UI を描画するため、初回は短い空白があります。
- コマンド一覧:
  - `npm run build` – Vite 本番ビルド。`dist` 配下は `/shake-streamkit/` 配下に配置してください。
  - `npm run preview` – ビルド済みをローカルで配信。
- `npm test` – Vitest（JSDOM）で `Shake-Streamkit-NW/**/*.test.[jt]s?(x)` を実行(`vite.config.ts:60-79`)。
- HTTPS/カメラが必要なときは上記 SSL スクリプトを使い `.env.local` に `SERVER_SSLCERT` / `SERVER_SSLKEY` を書き込み、`npm start -- --https` するだけでカスタム証明書が適用されます(`vite.config.ts:55-58`)。

### 5. WebSocket 接続の仕組み
- WebSocketClient は `WebSocketProvider` で定義されており、EnvironmentProvider から判定したプロトコル（https のとき `wss://`）と設定済みホストを結合して URL を作ります(`Shake-Streamkit-NW/modules/telemetry/components/WebSocketProvider.tsx:1-27`)。Vite 環境変数 `VITE_WS_SERVER` がフォールバック先です。
- 実際の接続は `useWebsocketTelemetry` フックで Web Worker を立ち上げ、`reconnecting-websocket` による自動再接続を行います。接続・切断・メッセージ受信イベントは通知ログと Redux Telemetry に流し込み、`matchmaking` イベントが届いたら現在の Match を自動選択します(`Shake-Streamkit-NW/modules/telemetry/hooks/websocket.ts:1-75`)。
- Worker は JSON メッセージを `ShakeEvent` としてパースし、`connectionTimeout=15s`、`minUptime=30s` の自動再接続ポリシーを適用します(`Shake-Streamkit-NW/modules/telemetry/utils/websocket.worker.ts:1-82`)。切断時は retryCount も通知されるため、ログビューで原因が追跡できます。
- 接続先ホストは Settings→Data Source のサーバ欄で変更できます。ここではプロトコルを除いた `host[:port]` を入力し、正規表現 `hostport` でバリデーション、Save ボタンで `config.server` が永続化されます(`Shake-Streamkit-NW/modules/settings/components/ServerAddressBox.tsx:1-64`, `Shake-Streamkit-NW/modules/settings/utils/regex.ts:1-15`, `Shake-Streamkit-NW/modules/settings/slicers/index.ts:57-64`)。保存前でもプレビュー欄には入力値が反映されますが、実際の接続は Save 後のみ更新される点に注意してください。
- Data Source ページでは WebSocketStatus が URL 付きで接続/未接続を表示し、クリック不要で状態を確認できます(`Shake-Streamkit-NW/modules/settings/pages/DataSourcePage.tsx:22-109`, `Shake-Streamkit-NW/modules/telemetry/components/WebSocketStatus.tsx:1-30`)。接続／切断は通知にも出るため視認性が高いです(`Shake-Streamkit-NW/modules/notification/components/NotificationController/index.tsx:12-77`)。
- `.env` 例:
  ```env
  VITE_WS_SERVER=localhost:4649
  SERVER_SSLCERT=.dev/ssl/localhost.crt
  SERVER_SSLKEY=.dev/ssl/localhost.key
  ```

### 6. テレメトリ JSON の構造
- ShakeStreamKit が理解する JSON は `Shake-Streamkit-NW/modules/telemetry/models/telemetry.ts:1-58` で型定義されています。1 行 1 オブジェクトの NDJSON 形式で、主なイベントは以下です（`session` は ShakeScouter のソケットセッション ID）:
  - `matchmaking` – 新しい試合開始のマーカー。受信するとテレメトリバッファをリセットし、新規 `entities` エントリを用意します(`Shake-Streamkit-NW/modules/telemetry/slicers/index.ts:23-198`)。
  - `game_stage` – ステージ ID。列挙は `Shake-Streamkit-NW/modules/telemetry/models/constant.ts:17-30` にあり、コメントに日本語名が付いています。
  - `game_update` – 各 Wave の進行状況。`color`(`ShakeColor`)、`count`（残り時間）、`amount`（回収済み金イクラ）、`quota`、`players[4]`（alive/gegg フラグ）、`unstable` を持ちます。`wave` は 1–5 または `'extra'`。Extra Wave の場合 `amount/ quota` は含まれず、`game_king` イベントと組で処理されます。
  - `game_result` – 試合終了時の `golden` / `power`。
  - `game_error` – ネットワーク等のエラー。
- `Shake-Streamkit-NW/modules/telemetry/models/data.ts:1-56` ではフロントが保持する整形済み構造を定義しており、`ShakeTelemetry` 内に Wave ごとの `updates` 配列を蓄積します。`TelemetryProcessor` が連続値チェックやプレイヤーステータスの区間化を担当し、`addTelemetry` reducer で `matches` と `entities` を更新します(`Shake-Streamkit-NW/modules/telemetry/utils/processor.ts:1-200`, `Shake-Streamkit-NW/modules/telemetry/slicers/index.ts:23-205`)。
- `getMatchFromTelemetry` は終了済み試合を `realtime / failed_waveX / cleared` などのタイプに分類し、MatchSelector に供給します(`Shake-Streamkit-NW/modules/telemetry/utils/getMatchFromTelemetry.ts:1-38`)。
- 期待される JSON 例（NDJSON の 1 行）:
  ```json
  {"session":"f70a...","event":"game_update","timestamp":1718000123,"wave":2,"color":"pink","quota":23,"amount":18,"count":45,"players":[{"alive":true,"gegg":false},...],"unstable":false}
  ```
- `FileInput` は各行を `JSON.parse` するだけなので、ShakeScouter 側から出力する際は改行区切りで出すのが確実です(`Shake-Streamkit-NW/modules/settings/components/FileInput.tsx:1-41`)。

### 7. 画面の説明
- **OverlayHost**: 3 つの子コンポーネントを縦に並べています(`Shake-Streamkit-NW/modules/overlay/components/OverlayHost/index.tsx:1-25`)。
  - *CameraPreview* – ブラウザで開いた際のみ（OBS/XSplit 等の UA を検出しなかった場合）表示され、Settings→Development で選んだカメラを 16:9 / 30fps で表示します。HTTPS でなければ enumerateDevices が走らないので要 TLS(`Shake-Streamkit-NW/modules/overlay/components/CameraPreview/index.tsx:1-55`, `Shake-Streamkit-NW/modules/settings/components/CameraSelector.tsx:1-100`)。
  - *OverlayEggGraph* – Golden Egg グラフ。Redux から現在選択中の Telemetry / Wave を取得し、Extra Wave は自動的に非表示になります(`Shake-Streamkit-NW/modules/overlay/components/OverlayEggGraph/index.tsx:11-80`)。`EggGraph` 本体では Wave／Quota／Clear/Fail ステータスヘッダ、Y 軸（イクラ数）、X 軸（残り時間）、プレイヤー生存/金イクラ所持バー（オプション）を描画します(`Shake-Streamkit-NW/modules/core/components/EggGraph/index.tsx:1-145`, `Shake-Streamkit-NW/modules/core/components/PlayerStatus/index.tsx:1-55`)。`colorLock` をオフにするとイベントの `color` が CSS クラスに反映されます。
  - *ProductLogo* – `overlay.poweredby` が true の 3 秒間だけスライド表示されます。これは試合が closed 状態になった直後、次の `addTelemetry` が来たタイミングで middleware が出します(`Shake-Streamkit-NW/modules/overlay/components/ProductLogo/index.tsx:1-25`, `Shake-Streamkit-NW/modules/overlay/middlewares/index.ts:26-84`)。
- **OverlayController**: MatchSelector（時刻昇順で session を表示）、WaveSelector（Extra を除く各 wave のボタン＋「Hide Overlay」）、WebSocketStatus（チェック／バツアイコン付き）から成り、全て i18n 対応です(`Shake-Streamkit-NW/modules/overlay/components/OverlayController/index.tsx:1-45`, `Shake-Streamkit-NW/modules/overlay/components/MatchSelector.tsx:1-71`, `Shake-Streamkit-NW/modules/overlay/components/WaveSelector.tsx:1-68`)。初期状態では `matches.length===0` なので MatchSelector が disabled になり、Placeholder の “No Data” が表示されるのが「データなし」メッセージの正体です。
- **Settings Window**（Radix Dialog、`Shake-Streamkit-NW/modules/settings/index.tsx:1-69`）:
  - General タブではオーバーレイ自動非表示、Quota/Wave 完了での表示、UI 言語を設定します（Redux Persist でローカルストレージ保存、`Shake-Streamkit-NW/modules/settings/pages/GeneralPage.tsx:1-93`）。言語リストは `Shake-Streamkit-NW/modules/core/utils/language.ts:8-41` に定義された 13 言語です。
  - Advanced タブは表示時間（0.1–15s）、プレイヤーステータス表示、Reduce motion、Color lock を設定します(`Shake-Streamkit-NW/modules/settings/pages/AdvancedPage.tsx:1-120`)。
  - Data Source タブで WebSocket サーバ、ファイル入力、シミュレーション再生（0.5–10x）が扱えます。Simulation を有効にすると `RealtimeTelemetrySimulator` が timestamp 間隔を再現して `addTelemetry` を送ります(`Shake-Streamkit-NW/modules/settings/pages/DataSourcePage.tsx:22-109`, `Shake-Streamkit-NW/modules/telemetry/utils/simulator.ts:1-58`)。無効な場合はファイル全体を即時ロードし、最初の `session` を自動選択します。
  - Log タブは最新 63 件 / 3 時間以内のログを一覧表示します(`Shake-Streamkit-NW/modules/settings/pages/LogPage.tsx:1-46`, `Shake-Streamkit-NW/modules/notification/slicers/index.ts:4-56`)。
  - Development タブでは通知トーストのテスト（dev build 限定）、カメラ選択（非 OBS ブラウザのみ表示）、環境情報が確認できます(`Shake-Streamkit-NW/modules/settings/pages/DevelopmentPage.tsx:1-82`)。
  - About タブはアプリバージョン（`import.meta.env.APP_VERSION`）やライセンスを表示します。
- **通知／ログ**: WebSocket 接続イベントやテストトーストは `NotificationController` → Radix Toast で表示され、切断は 2 分以内の連続発生を抑制します（本番時のみ）。`Log` タブと内容は同じです(`Shake-Streamkit-NW/modules/notification/components/NotificationController/index.tsx:12-77`)。
- **初期遷移**: WebSocket に接続しても ShakeScouter から `matchmaking` が届くまでは `telemetry.entities` が存在せず、MatchSelector と WaveSelector は無効／空のままです。この状態が「データなし」。`matchmaking` 受信で `setMatch` されると Wave ボタンが並び始め、Overlay の Slide アニメーションが起動します（`Shake-Streamkit-NW/modules/telemetry/hooks/websocket.ts:50-54`）。

### 8. トラブルシュート
- **WebSocket が接続できない** – `Server Address` 入力が不正だと Save ボタンが無効のままです。`host[:port]` 形式以外は受け付けません(`Shake-Streamkit-NW/modules/settings/components/ServerAddressBox.tsx:25-63`)。`.env` の `VITE_WS_SERVER` はプロトコル抜きで記述してください。接続状況は Settings と Overlay 下部の両方で確認できます。
- **常に “No Data”** – ShakeScouter から `matchmaking` が届かないと Telemetry context が開かれません(`Shake-Streamkit-NW/modules/telemetry/utils/processor.ts:43-74`)。ShakeScouter 側で Salmon Run の部屋に入ったタイミングで `matchmaking` イベントを送っているか確認し、録画ファイルの場合は先頭に `matchmaking` 行が含まれるかチェックしてください。
- **Overlay が勝手に消えない／出てこない** – `General` タブで自動表示するイベントを有効にし、`Advanced` タブで表示時間を調整してください。Overlay middleware は quota 達成 or wave 終了時に `showEggGraph` を dispatch し、`config.autoHide` が false のときは手動で Hide ボタンを押すまで残り続けます(`Shake-Streamkit-NW/modules/overlay/middlewares/index.ts:36-84`, `Shake-Streamkit-NW/modules/settings/pages/GeneralPage.tsx:48-80`, `Shake-Streamkit-NW/modules/settings/pages/AdvancedPage.tsx:63-118`)。
- **Mixed Content / ブラウザソースで警告** – `WebSocketProvider` は `window.location.protocol` が https の場合は自動的に `wss://` を使います(`Shake-Streamkit-NW/modules/telemetry/components/WebSocketProvider.tsx:16-24`)。OBS の Browser Source を https で提供しているなら、ShakeScouter 側も wss で公開するか、開発時のみ http でアクセスしてください。
- **カメラプレビューが空白** – `CameraSelector` はページが https で提供されていない場合は `navigator.permissions` を使わず即 return します(`Shake-Streamkit-NW/modules/settings/components/CameraSelector.tsx:24-59`)。SSL スクリプトでローカル証明書を設定するか、OBS 側ブラウザソース（https）経由で開く必要があります。
- **ファイル読み込みで何も起きない** – JSON ファイルは 1 行 = 1 イベントであり、空行はスキップされます(`Shake-Streamkit-NW/modules/settings/components/FileInput.tsx:5-39`)。ShakeScouter のログをそのまま保存した NDJSON を渡してください。`.json` 拡張子以外は選択できません。
- **Node/npm でビルドエラー** – Node 16 以前では Vite 5 が起動しません。nvm などで 18 以上に切り替えてください。`npm cache clean --force` では解決しません。
- **ポート競合** – Vite は 5173 を使います。`npm start -- --port 4173` などで回避してください。`base: '/shake-streamkit/'` は本番の公開パスにのみ影響します。
- **通知がスパム化する** – 切断通知は 2 分以内の重複を抑制しているため、本番配信中にポップアップが連発する場合は `import.meta.env.DEV` のままビルドしていないか確認してください(`Shake-Streamkit-NW/modules/notification/components/NotificationController/index.tsx:12-77`)。

### 9. 付録
- **主要ファイル構造と責務**
  ```
  Shake-Streamkit-NW/
    index.tsx — Redux Provider, EnvironmentProvider, WebSocketProvider を束ねるエントリ(`Shake-Streamkit-NW/index.tsx:1-40`)
    app/App.tsx — OverlayHost + Notification + Settings/Controller の組み立て(`Shake-Streamkit-NW/app/App.tsx:3-22`)
    modules/
      core/ — 環境検出・i18n・グラフ・コントロール類。
        components/EnvironmentProvider (`Shake-Streamkit-NW/modules/core/components/EnvironmentProvider/index.tsx:1-37`)
        components/EggGraph (`Shake-Streamkit-NW/modules/core/components/EggGraph/index.tsx:1-145`)
        components/PlayerStatus (`Shake-Streamkit-NW/modules/core/components/PlayerStatus/index.tsx:1-55`)
        utils/language (`Shake-Streamkit-NW/modules/core/utils/language.ts:8-41`)
        utils/collection (`Shake-Streamkit-NW/modules/core/utils/collection.ts:1-27`)
      telemetry/ — WebSocket 接続、ShakeEvent モデル、TelemetryProcessor、Redux Slice。
        components/WebSocketProvider (`Shake-Streamkit-NW/modules/telemetry/components/WebSocketProvider.tsx:1-27`)
        hooks/websocket (`Shake-Streamkit-NW/modules/telemetry/hooks/websocket.ts:1-75`)
        models/telemetry・data・constant (`Shake-Streamkit-NW/modules/telemetry/models/*.ts`)
        utils/websocket.worker (`Shake-Streamkit-NW/modules/telemetry/utils/websocket.worker.ts:1-84`)
        utils/processor (`Shake-Streamkit-NW/modules/telemetry/utils/processor.ts:1-200`)
        slicers (`Shake-Streamkit-NW/modules/telemetry/slicers/index.ts:1-205`)
      overlay/ — Overlay UI, Match/Wave セレクタ、auto display middleware。
        components/OverlayEggGraph (`Shake-Streamkit-NW/modules/overlay/components/OverlayEggGraph/index.tsx:11-80`)
        components/MatchSelector (`Shake-Streamkit-NW/modules/overlay/components/MatchSelector.tsx:1-71`)
        components/WaveSelector (`Shake-Streamkit-NW/modules/overlay/components/WaveSelector.tsx:1-68`)
        components/OverlayHost (`Shake-Streamkit-NW/modules/overlay/components/OverlayHost/index.tsx:1-25`)
        slicers (`Shake-Streamkit-NW/modules/overlay/slicers/index.ts:1-93`)
        middlewares (`Shake-Streamkit-NW/modules/overlay/middlewares/index.ts:10-84`)
      settings/ — Radix ベースの設定タブ、Redux Persist を利用 (`Shake-Streamkit-NW/modules/settings/slicers/index.ts:1-100`)。
        pages/General/Advanced/DataSource/Log/Development (`Shake-Streamkit-NW/modules/settings/pages/*.tsx`)
        components/ServerAddressBox, CameraSelector, FileInput, LanguageSelector
      notification/ — WebSocket ログ表示、Radix Toast、ログ slice (`Shake-Streamkit-NW/modules/notification/components/NotificationController/index.tsx:12-77`, `Shake-Streamkit-NW/modules/notification/slicers/index.ts:4-56`)
    wdyr.ts — 開発時のみ why-did-you-render を有効化して再レンダリングを追跡
  scripts/
    ssl_mac.sh, ssl_win.bat — mkcert を使ったローカル TLS 設定
  types/
    collection.d.ts — Array.prototype 拡張の型定義
  public/
    locales/*.json — 多言語辞書（IntlLoader が fetch）
  ```
- **テスト・ビルド**: `npm test` は Vitest + React Testing Library で JS DOM を使います。`npm run build` は LightningCSS を使った最適化を行い、Subresource Integrity も付与します(`vite.config.ts:18-52`)。
- **言語ファイルの追加**: `public/locales/<locale>.json` を追加し、`LANGUAGES` にエントリを足せば `LanguageSelector` に反映されます。
- **BGM / Animation**: `useBodyClass` が `prefers-reduced-motion` や OBS ブラウザモードを見て body クラスを切り替え、背景やブラーを抑制します(`Shake-Streamkit-NW/modules/core/hooks/bodyclass.ts:7-34`)。
- **Persist の仕組み**: `redux-persist` が `config` slice を `localStorage` (`key=conf`) に保存し、`PersistGate` が rehydration を待つため設定が確実に反映されます(`Shake-Streamkit-NW/app/store.ts:23-33`, `Shake-Streamkit-NW/modules/settings/slicers/index.ts:77-100`)。

この README だけで ShakeStreamKit を立ち上げ、ShakeScouter の WebSocket さえ用意すればオーバーレイを動かせるはずです。最後に、ビルドや本番配信前には `npm run build && npm run preview` で最終確認し、`ShakeScouter` の WebSocket JSON が仕様どおりかどうかを必ずチェックしてください。

### 更新履歴
- 2024-11-19: ディレクトリ構成を Shake-Streamkit-NW ベースに統一し、旧 src ディレクトリ前提の表記を整理。
