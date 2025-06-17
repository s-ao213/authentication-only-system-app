// ===== src/app/signup/page.tsx =====
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const secretQuestions = [
  'あなたの好きな色は？',
  'あなたの出身地は？',
  'あなたの好きな食べ物は？',
  'あなたの初恋の人の名前は？',
  'あなたのペットの名前は？',
];

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [secretQuestion, setSecretQuestion] = useState('');
  const [secretAnswer, setSecretAnswer] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('パスワードが一致しません');
      setLoading(false);
      return;
    }

    if (!secretQuestion || !secretAnswer) {
      setError('秘密の質問と答えを入力してください');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          secretQuestion,
          secretAnswer,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push('/login');
      } else {
        setError(data.error || '登録に失敗しました');
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
            新規登録
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
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
                placeholder="メールアドレス"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                パスワード
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="パスワード"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                placeholder="パスワード（確認）"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="secretQuestion" className="block text-sm font-medium text-gray-700">
                秘密の質問
              </label>
              <select
                id="secretQuestion"
                name="secretQuestion"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={secretQuestion}
                onChange={(e) => setSecretQuestion(e.target.value)}
              >
                <option value="">質問を選択してください</option>
                {secretQuestions.map((question) => (
                  <option key={question} value={question}>
                    {question}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="secretAnswer" className="block text-sm font-medium text-gray-700">
                秘密の質問の答え
              </label>
              <input
                id="secretAnswer"
                name="secretAnswer"
                type="text"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="秘密の質問の答え"
                value={secretAnswer}
                onChange={(e) => setSecretAnswer(e.target.value)}
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
              {loading ? '登録中...' : '登録'}
            </button>
          </div>

          <div className="text-center">
            <Link
              href="/login"
              className="text-indigo-600 hover:text-indigo-500"
            >
              既にアカウントをお持ちの方はこちら
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
