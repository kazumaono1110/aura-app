# Aura アプリ 申し送り書

## アプリ概要
気分を一言入力すると、AIがパーソナライズされたオーラカード（カラーパレット + 詳細な読み解き）を生成するWebアプリ。

## 本番URL
- **アプリ**: https://aura-app-ecru.vercel.app
- **GitHub**: https://github.com/kazumaono1110/aura-app

## 技術スタック
- Next.js 16.2.1 / React 19 / Tailwind CSS 4
- Supabase (認証 + PostgreSQL DB)
- OpenAI GPT-4o-mini (オーラ生成)
- Vercel (ホスティング、GitHub連携で自動デプロイ)

## 主要機能
| 機能 | 状態 | 備考 |
|------|------|------|
| オーラ生成 | 完了 | AI生成。履歴・日時・季節をコンテキストとしてプロンプトに注入 |
| Googleログイン | 完了 | Supabase Auth + Google OAuth |
| ギャラリー | 完了 | ログイン時はSupabase DB、未ログイン時はlocalStorage |
| ギャラリー削除 | 完了 | モーダル内の削除ボタン |
| シェア機能 | 完了 | LINE / Instagram Story / X の3つ |
| PWA対応 | 完了 | manifest.json + アイコン設置済み |
| 利用規約 | 完了 | /terms |
| プライバシーポリシー | 完了 | /privacy |

## 外部サービスの認証情報

### Supabase
- **Project URL**: https://cxgbrqhpkblyvhgeofxf.supabase.co
- **Dashboard**: https://supabase.com/dashboard (KAZUMA組織 > aura-app)
- **DB**: `auras` テーブル (RLS有効、ユーザーごとのアクセス制御済み)

### Google OAuth
- **Google Cloud Console**: https://console.cloud.google.com (プロジェクト: aura-app)
- **OAuth Client**: ウェブ クライアント 1
- **Client ID**: 1062815767403-tij9u2b18v6noroi35d6ge55hcjrmkd7.apps.googleusercontent.com
- **リダイレクトURI**: https://cxgbrqhpkblyvhgeofxf.supabase.co/auth/v1/callback

### Vercel
- **Dashboard**: https://vercel.com (kazumaono1110アカウント)
- **環境変数**: OPENAI_API_KEY, NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY

### OpenAI
- **API Key**: .env.local に設定済み（Vercel環境変数にも設定済み）
- **モデル**: gpt-4o-mini

## ファイル構成
```
app/
├── page.tsx           # トップページ
├── create/page.tsx    # オーラ生成ページ（メイン機能）
├── gallery/page.tsx   # ギャラリー（履歴一覧 + 詳細モーダル + 削除）
├── auth/page.tsx      # ログインページ（Google OAuth）
├── terms/page.tsx     # 利用規約
├── privacy/page.tsx   # プライバシーポリシー
├── api/
│   ├── generate/route.ts  # オーラ生成API（OpenAI連携）
│   └── weather/route.ts   # 天気API（現在未使用）
├── layout.tsx         # ルートレイアウト（AuthProvider）
└── globals.css        # グローバルCSS

components/
├── AuthContext.tsx     # 認証状態管理（useAuth フック）
└── AuthButton.tsx     # ログイン/ログアウトUI

lib/
├── supabase.ts        # Supabaseクライアント
└── types.ts           # 共通型定義

supabase/
└── schema.sql         # DBスキーマ（テーブル + RLS + インデックス）

public/
├── manifest.json      # PWA設定
├── icon-192.png       # PWAアイコン（192x192）
├── icon-512.png       # PWAアイコン（512x512）
└── icon.svg           # アイコン元データ
```

## デプロイ方法
GitHubの `main` ブランチにプッシュすると、Vercelが自動でビルド・デプロイします。

## 今後の実装候補（未着手）
- **収益化**: フリーミアム（1日1回制限 + 月額課金）— まず無料でユーザーを集めてから導入予定
- **OGP画像**: SNSでURL共有時のプレビュー画像
- **localStorageインポート**: ログイン前のデータをログイン後にDBへ移行
- **カスタムドメイン**: Vercel + Supabase（Supabase側はProプラン月$25が必要）
- **週間/月間トレンド**: オーラ履歴の可視化グラフ

## 既知の制限
- Supabaseの認証画面URL（cxgbrqhpkblyvhgeofxf.supabase.co）がユーザーに見える → Proプランでカスタムドメイン対応可能
- Instagram Storyへの直接投稿はWeb APIの制限で不可 → OS標準の共有メニュー経由
- 天気APIルート（/api/weather）は実装済みだが、位置情報取得を削除したため現在未使用
