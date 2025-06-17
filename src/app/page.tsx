// ===== src/app/page.tsx =====
import Link from 'next/link';
import { getSession } from '@/lib/auth';

export default async function HomePage() {
  const session = await getSession();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          認証システム
        </h1>
        <p className="mt-2 text-center text-sm text-gray-600">
          セキュアな認証機能を備えたアプリケーション
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {session ? (
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-lg text-gray-900">
                  ようこそ、{session.email}さん
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  既にログインしています
                </p>
              </div>
              <div>
                <Link
                  href="/dashboard"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  ダッシュボードへ
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <Link
                  href="/login"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  ログイン
                </Link>
              </div>
              <div>
                <Link
                  href="/signup"
                  className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  新規登録
                </Link>
              </div>
              <div className="text-center">
                <Link
                  href="/reset-password"
                  className="text-sm text-indigo-600 hover:text-indigo-500"
                >
                  パスワードを忘れた方
                </Link>
              </div>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="text-center">
              <h3 className="text-sm font-medium text-gray-900 mb-3">
                搭載機能
              </h3>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>✓ セッションベース認証</li>
                <li>✓ ログイン通知メール</li>
                <li>✓ 秘密の質問によるパスワードリセット</li>
                <li>✓ セキュアなパスワードハッシュ化</li>
                <li>✓ セッション管理とアクセス制御</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}