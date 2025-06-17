// ===== src/app/reset-password/page.tsx =====
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ResetPasswordPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [secretQuestion, setSecretQuestion] = useState('');
  const [secretAnswer, setSecretAnswer] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, step: 'get-question' }),
      });

      const data = await response.json();

      if (response.ok) {
        setSecretQuestion(data.secretQuestion);
        setStep(2);
      } else {
        setError(data.error || 'ユーザーが見つかりません');
      }
    } catch {
      setError('ネットワークエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (newPassword !== confirmPassword) {
      setError('パスワードが一致しません');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          secretAnswer,
          newPassword,
          step: 'reset-password',
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('パスワードがリセットされました。新しいパスワードでログインしてください。');
        router.push('/login');
      } else {
        setError(data.error || 'パスワードリセットに失敗しました');
      }
    } catch {
      setError('ネットワークエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            パスワードリセット
          </h2>
        </div>

        {step === 1 && (
          <form className="mt-8 space-y-6" onSubmit={handleEmailSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                メールアドレス
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="登録したメールアドレスを入力"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? '確認中...' : '次へ'}
              </button>
            </div>
          </form>
        )}

        {step === 2 && (
          <form className="mt-8 space-y-6" onSubmit={handleResetSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  秘密の質問
                </label>
                <div className="mt-1 p-3 bg-gray-100 rounded-md">
                  {secretQuestion}
                </div>
              </div>
              <div>
                <label htmlFor="secretAnswer" className="block text-sm font-medium text-gray-700">
                  答え
                </label>
                <input
                  id="secretAnswer"
                  name="secretAnswer"
                  type="text"
                  required
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="秘密の質問の答えを入力"
                  value={secretAnswer}
                  onChange={(e) => setSecretAnswer(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                  新しいパスワード
                </label>
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  required
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="新しいパスワード"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  パスワード（確認）
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="新しいパスワード（確認）"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? 'リセット中...' : 'パスワードをリセット'}
              </button>
            </div>
          </form>
        )}

        <div className="text-center">
          <Link
            href="/login"
            className="text-indigo-600 hover:text-indigo-500"
          >
            ログインページに戻る
          </Link>
        </div>
      </div>
    </div>
  );
}