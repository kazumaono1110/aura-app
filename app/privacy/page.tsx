"use client";

import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="flex flex-col items-center min-h-dvh px-4 py-10">
      <div className="w-full max-w-md mb-8">
        <Link href="/auth" className="text-sm text-white/40 hover:text-white/70 transition-colors">
          &larr; 戻る
        </Link>
      </div>

      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold mb-8">プライバシーポリシー</h1>

        <div className="space-y-6 text-sm text-white/60 leading-relaxed">
          <section>
            <h2 className="text-base font-semibold text-white/80 mb-2">1. 収集する情報</h2>
            <p>本サービスでは、以下の情報を収集します。</p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>Googleアカウントのメールアドレスおよび表示名（ログイン時）</li>
              <li>ユーザーが入力した気分テキスト</li>
              <li>生成されたオーラカードのデータ（色、テキスト等）</li>
              <li>利用日時</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-white/80 mb-2">2. 情報の利用目的</h2>
            <p>収集した情報は以下の目的で利用します。</p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>オーラカードの生成およびパーソナライズ</li>
              <li>ユーザーの履歴データの保存と表示</li>
              <li>サービスの改善</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-white/80 mb-2">3. 第三者への提供</h2>
            <p>
              ユーザーの個人情報を第三者に提供することはありません。ただし、オーラカード生成のためにユーザーが入力したテキストはOpenAI APIに送信されます。OpenAIのプライバシーポリシーについてはOpenAI社のサイトをご参照ください。
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-white/80 mb-2">4. データの保存</h2>
            <p>
              ログイン済みユーザーのデータはSupabase（クラウドデータベース）に保存されます。未ログインの場合、データはブラウザのローカルストレージにのみ保存され、サーバーには送信されません。
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-white/80 mb-2">5. データの削除</h2>
            <p>
              ユーザーはアカウントの削除を希望する場合、運営者に連絡することでデータの削除を請求できます。
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-white/80 mb-2">6. Cookieについて</h2>
            <p>
              本サービスでは、認証状態の管理のためにCookieおよびローカルストレージを使用します。
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-white/80 mb-2">7. ポリシーの変更</h2>
            <p>
              本ポリシーは、必要に応じて変更されることがあります。変更後のポリシーは、本サービス上に掲載した時点で効力を生じるものとします。
            </p>
          </section>

          <p className="text-white/30 text-xs pt-4">2026年3月25日 制定</p>
        </div>
      </div>
    </div>
  );
}
