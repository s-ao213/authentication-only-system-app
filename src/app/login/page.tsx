'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

declare global {
  interface Window {
    grecaptcha: {
      render: (container: string | HTMLElement, parameters: {
        sitekey: string;
        callback?: (token: string) => void;
        'expired-callback'?: () => void;
      }) => number;
      reset: (id?: number) => void;
      getResponse: (id?: number) => string;
    };
  }
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState('');
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false);
  const recaptchaRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const initializationRef = useRef(false);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;

    const initializeRecaptcha = () => {
      // 既に初期化済みまたはマウント解除済みの場合は処理しない
      if (!mounted || initializationRef.current) {
        return;
      }

      if (window.grecaptcha && window.grecaptcha.render && containerRef.current) {
        try {
          // コンテナをクリア
          containerRef.current.innerHTML = '';
          
          const widgetId = window.grecaptcha.render(containerRef.current, {
            'sitekey': process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '',
            'callback': (token: string) => {
              if (mounted) {
                setRecaptchaToken(token);
              }
            },
            'expired-callback': () => {
              if (mounted) {
                setRecaptchaToken('');
              }
            }
          });
          
          recaptchaRef.current = widgetId;
          initializationRef.current = true;
          setRecaptchaLoaded(true);
        } catch (error) {
          console.error('reCAPTCHA render error:', error);
          // エラーが発生した場合は初期化フラグをリセット
          initializationRef.current = false;
        }
      } else {
        // reCAPTCHAがまだ読み込まれていない場合は少し待つ
        setTimeout(() => {
          if (mounted) {
            initializeRecaptcha();
          }
        }, 100);
      }
    };

    // 初期化を開始
    initializeRecaptcha();

    // クリーンアップ関数
    return () => {
      mounted = false;
      if (recaptchaRef.current !== null && window.grecaptcha) {
        try {
          window.grecaptcha.reset(recaptchaRef.current);
        } catch (error) {
          console.error('reCAPTCHA reset error:', error);
        }
      }
      initializationRef.current = false;
      recaptchaRef.current = null;
    };
  }, []); // 依存配列を空にして一回だけ実行

  const resetRecaptcha = () => {
    if (window.grecaptcha && recaptchaRef.current !== null) {
      try {
        window.grecaptcha.reset(recaptchaRef.current);
        setRecaptchaToken('');
      } catch (error) {
        console.error('reCAPTCHA reset error:', error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!recaptchaToken) {
      setError('reCAPTCHA認証を完了してください');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          password,
          recaptchaToken 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push('/dashboard');
      } else {
        setError(data.error || 'ログインに失敗しました');
        resetRecaptcha();
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'ネットワークエラーが発生しました';
      setError(errorMessage);
      resetRecaptcha();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            ログイン
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                メールアドレス
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="メールアドレス"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                パスワード
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="パスワード"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* reCAPTCHA */}
          <div className="flex justify-center flex-col items-center space-y-2">
            <div ref={containerRef} id="recaptcha-container"></div>
            {recaptchaToken && (
              <p className="text-xs text-green-600">✓ reCAPTCHA認証完了</p>
            )}
            {/* デバッグ用：reCAPTCHAリセットボタン */}
            {process.env.NODE_ENV === 'development' && recaptchaLoaded && (
              <button
                type="button"
                onClick={resetRecaptcha}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                reCAPTCHAをリセット（開発用）
              </button>
            )}
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading || !recaptchaLoaded || !recaptchaToken}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? 'ログイン中...' : 'ログイン'}
            </button>
          </div>

          <div className="text-center space-y-2">
            <Link
              href="/signup"
              className="text-indigo-600 hover:text-indigo-500"
            >
              新規登録
            </Link>
            <br />
            <Link
              href="/reset-password"
              className="text-indigo-600 hover:text-indigo-500"
            >
              パスワードを忘れた方
            </Link>
          </div>
        </form>

        {/* 開発環境での説明 */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-xs text-yellow-800">
              <strong>開発環境での注意:</strong><br />
              reCAPTCHAが画像認証を表示しない場合があります。<br />
              これは正常な動作で、人間と判定されているためです。<br />
              本番環境では異なる動作になる可能性があります。
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
