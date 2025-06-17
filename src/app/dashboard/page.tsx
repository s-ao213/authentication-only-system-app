// ===== src/app/dashboard/page.tsx =====
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import LogoutButton from '../dashboard/LogoutButton';

export default async function DashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                ダッシュボード
              </h1>
            </div>
            <div className="flex items-center">
              <LogoutButton />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-2">
                ようこそ、{session.email}さん！
              </h2>
              <p className="text-gray-600">
                ログインが完了しました。このページはログイン後のみアクセス可能です。
              </p>
              <div className="mt-4 p-4 bg-blue-50 rounded-md">
                <h3 className="text-sm font-medium text-blue-800">
                  セキュリティ機能
                </h3>
                <ul className="mt-2 text-sm text-blue-700">
                  <li>• ログイン時にメール通知を送信</li>
                  <li>• 秘密の質問によるパスワードリセット機能</li>
                  <li>• セッションベースの認証</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}