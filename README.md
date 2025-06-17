# 🔐 セキュア認証システム

[![Next.js](https://img.shields.io/badge/Next.js-15.3.3-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.9.0-2D3748)](https://www.prisma.io/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.3.2-06B6D4)](https://tailwindcss.com/)

## 📋 概要

このプロジェクトは、**ガチガチにセキュアな設計**を重視した認証専用システムです。現代のWebアプリケーションに必要なセキュリティ機能を網羅的に実装し、実際のプロダクション環境でも使用できるレベルのセキュリティ対策を施しています。

### 🎯 プロジェクトの特徴

- **🛡️ 多層防御**: CSP、XSS対策、CSRF対策を含む包括的なセキュリティ
- **🔒 最新の暗号化**: bcryptによるパスワードハッシュ化（ソルトラウンド10）
- **🍪 セキュアなセッション管理**: JWTとHTTPOnly Cookieの組み合わせ
- **📧 リアルタイム通知**: ログイン時の自動メール通知
- **🔑 パスワードリセット**: 秘密の質問による安全なパスワード復旧

## 🚀 技術スタック

### フロントエンド
- **Next.js 15.3.3** - React フレームワーク（App Router使用）
- **TypeScript** - 型安全性の確保
- **TailwindCSS** - レスポンシブデザイン

### バックエンド
- **Next.js API Routes** - サーバーサイドAPI
- **Prisma ORM** - データベース操作
- **SQLite** - 軽量データベース（本番ではPostgreSQL推奨）

### セキュリティ
- **bcrypt** - パスワードハッシュ化
- **jose** - JWT操作
- **zod** - バリデーション

### 開発・運用
- **ESLint** - コード品質管理
- **TypeScript** - 型チェック

## 🔒 セキュリティ機能

### 1. パスワードセキュリティ 🔐

```typescript
// bcryptによるパスワードハッシュ化（ソルトラウンド10）
const hashedPassword = await bcrypt.hash(password, 10);
```

- **パスワードハッシュ化**: bcryptライブラリでソルトラウンド10
- **パスワード強度**: 最低6文字以上の制限
- **秘密の質問**: パスワードリセット用の追加認証

### 2. セッション管理 🍪

```typescript
// セキュアなCookie設定
(await cookieStore).set('session', sessionToken, {
  httpOnly: true,                           // XSS攻撃防止
  secure: process.env.NODE_ENV === 'production', // HTTPS必須（本番環境）
  sameSite: 'lax',                         // CSRF攻撃防止
  expires: expiresAt,                      // 自動期限切れ（7日間）
});
```

### 3. CSP（Content Security Policy） 🛡️

```typescript
// 厳格なCSP設定
const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  font-src 'self';
  connect-src 'self';
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
  object-src 'none';
`;
```

### 4. セキュリティヘッダー 📡

- **X-Frame-Options**: クリックジャッキング攻撃防止
- **X-Content-Type-Options**: MIMEタイプスニッフィング攻撃防止
- **X-XSS-Protection**: ブラウザのXSS保護有効化
- **Referrer-Policy**: リファラー情報制御
- **Permissions-Policy**: ブラウザ機能アクセス制限

## 🌟 主要機能

### 1. ユーザー登録 📝

![ユーザー登録画面](https://via.placeholder.com/800x600/4F46E5/FFFFFF?text=User+Registration+Screen)

- **メールアドレス**: 重複チェック付き
- **パスワード**: 確認入力で入力ミス防止
- **秘密の質問**: 5種類から選択可能
- **バリデーション**: リアルタイム入力検証

### 2. セキュアログイン 🔑

![ログイン画面](https://via.placeholder.com/800x600/059669/FFFFFF?text=Secure+Login+Screen)

- **認証処理**: bcryptによるパスワード照合
- **セッション作成**: JWT + HTTPOnly Cookie
- **ログイン通知**: 自動メール送信
- **エラーハンドリング**: セキュリティに配慮したエラーメッセージ

### 3. パスワードリセット 🔄

![パスワードリセット画面](https://via.placeholder.com/800x600/DC2626/FFFFFF?text=Password+Reset+Screen)

**2段階認証プロセス**:
1. **メールアドレス確認**: 登録済みユーザーの検証
2. **秘密の質問**: 本人確認のセカンドファクター

## 🎨 ユーザーインターフェース

### ダッシュボード 📊

![ダッシュボード](https://via.placeholder.com/800x600/7C3AED/FFFFFF?text=Dashboard+Screen)

- **ユーザー情報表示**: セッション情報の表示
- **セキュリティ機能一覧**: 実装機能の説明
- **ログアウト機能**: セッション安全削除

## 📧 メール通知システム

### ログイン通知メール

```typescript
// 自動ログイン通知
export async function sendLoginNotification(email: string): Promise<void> {
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: email,
    subject: 'ログイン通知',
    html: `
      <h2>ログイン通知</h2>
      <p>お客様のアカウントにログインが検出されました。</p>
      <p><strong>ログイン時刻:</strong> ${new Date().toLocaleString('ja-JP')}</p>
      <p>心当たりがない場合は、速やかにパスワードを変更してください。</p>
    `,
  };
  await transporter.sendMail(mailOptions);
}
```

- **Gmail SMTP**: セキュアなメール送信
- **アプリパスワード**: OAuth2認証対応
- **HTML形式**: 視認性の高いメール

## 🗃️ データベース設計

### ERD（Entity Relationship Diagram）

```sql
-- Users テーブル
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    secretQuestion TEXT NOT NULL,
    secretAnswer TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Sessions テーブル
CREATE TABLE sessions (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    expiresAt DATETIME NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);
```

### データベース特徴
- **正規化**: 第3正規形まで正規化
- **外部キー制約**: データ整合性の保証
- **カスケード削除**: ユーザー削除時のセッション自動削除
- **インデックス**: email列にユニークインデックス

## 🛠️ セットアップ手順

### 1. 環境構築

```bash
# リポジトリクローン
git clone <repository-url>
cd authentication-only-system-app

# 依存関係インストール
npm install

# 環境変数設定
cp .env.example .env
```

### 2. 環境変数設定

```env
# Database
DATABASE_URL="file:./app.db"

# Session Secret（本番環境では32文字以上の安全な文字列を使用）
SESSION_SECRET="your-very-secure-session-secret-key-change-this-to-something-random"

# SMTP設定（Gmail推奨）
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"  # Gmailアプリパスワード

# Environment
NODE_ENV="development"
```

### 3. データベース初期化

```bash
# Prismaクライアント生成
npx prisma generate

# データベース作成
npx prisma db push

# 初期データ投入
npx prisma db seed
```

### 4. 開発サーバー起動

```bash
npm run dev
```

## 🧪 テストアカウント

開発用テストアカウント:
- **メールアドレス**: `test@example.com`
- **パスワード**: `testpass123`
- **秘密の質問**: 「あなたの好きな色は？」
- **答え**: `青`

## 🚀 本番デプロイ

### 本番環境設定

1. **環境変数の設定**
   ```env
   NODE_ENV="production"
   DATABASE_URL="postgresql://user:pass@host:port/dbname"
   SESSION_SECRET="production-secure-32-character-secret"
   ```

2. **セキュリティ設定の強化**
   ```typescript
   // より厳格なCSP（本番環境）
   const strictCspHeader = `
     default-src 'self';
     script-src 'self';
     style-src 'self';
     img-src 'self' data:;
     font-src 'self';
     connect-src 'self';
     frame-ancestors 'none';
   `;
   ```

3. **データベース移行**
   ```bash
   # PostgreSQL使用推奨
   npx prisma migrate deploy
   ```

## 📊 セキュリティ監査

### 実装済みセキュリティ対策チェックリスト

- ✅ **パスワードハッシュ化** (bcrypt + salt rounds 10)
- ✅ **セッション管理** (JWT + HTTPOnly Cookie)
- ✅ **CSP設定** (Content Security Policy)
- ✅ **セキュリティヘッダー** (X-Frame-Options, X-XSS-Protection等)
- ✅ **入力バリデーション** (zod)
- ✅ **SQL インジェクション対策** (Prisma ORM)
- ✅ **XSS対策** (React + CSP)
- ✅ **CSRF対策** (SameSite Cookie)
- ✅ **セッション期限管理** (7日間自動期限切れ)
- ✅ **パスワードリセット** (秘密の質問による二要素認証)

### セキュリティレベル評価

| 項目 | レベル | 説明 |
|------|--------|------|
| 認証 | 🔒🔒🔒🔒🔒 | bcrypt + JWT + 二要素認証 |
| セッション | 🔒🔒🔒🔒🔒 | HTTPOnly + Secure + SameSite |
| データ保護 | 🔒🔒🔒🔒🔒 | 暗号化 + ORM + バリデーション |
| 通信 | 🔒🔒🔒🔒⚪ | HTTPS推奨 + セキュリティヘッダー |
| 監査 | 🔒🔒🔒⚪⚪ | ログ出力 + エラーハンドリング |

## 🐛 トラブルシューティング

### よくある問題と解決方法

1. **メール送信エラー**
   ```bash
   # Gmailアプリパスワードの設定を確認
   # 2段階認証を有効化してからアプリパスワードを生成
   ```

2. **データベース接続エラー**
   ```bash
   # Prismaクライアントの再生成
   npx prisma generate
   npx prisma db push
   ```

3. **セッションエラー**
   ```bash
   # セッションシークレットの設定を確認
   # 32文字以上の安全な文字列を使用
   ```

## 🤝 コントリビューション

1. このリポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 📝 ライセンス

MIT License - 詳細は [LICENSE](LICENSE) ファイルを参照してください。

## 👨‍💻 作者

**あなたの名前**
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

---

<div align="center">
  <strong>🔐 セキュリティは妥協しない。常に最新のベストプラクティスを採用。</strong>
</div>
