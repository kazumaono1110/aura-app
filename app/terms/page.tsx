"use client";

import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="flex flex-col items-center min-h-dvh px-4 py-10">
      <div className="w-full max-w-md mb-8">
        <Link href="/auth" className="text-sm text-white/40 hover:text-white/70 transition-colors">
          &larr; 戻る
        </Link>
      </div>

      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold mb-8">利用規約</h1>

        <div className="space-y-6 text-sm text-white/60 leading-relaxed">
          <section>
            <h2 className="text-base font-semibold text-white/80 mb-2">第1条（適用）</h2>
            <p>
              本規約は、Aura（以下「本サービス」）の利用に関する条件を定めるものです。ユーザーは本規約に同意の上、本サービスを利用するものとします。
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-white/80 mb-2">第2条（サービスの内容）</h2>
            <p>
              本サービスは、ユーザーが入力した気分テキストに基づき、AIを用いてオーラカード（カラーパレットおよびテキスト）を生成するサービスです。生成される内容はエンターテインメント目的であり、医療・心理的な助言を構成するものではありません。
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-white/80 mb-2">第3条（アカウント）</h2>
            <p>
              ユーザーはGoogleアカウントを使用してログインすることで、オーラカードの履歴をサーバーに保存できます。アカウント情報の管理はユーザー自身の責任とします。
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-white/80 mb-2">第4条（禁止事項）</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>本サービスの不正利用またはサーバーへの過度な負荷</li>
              <li>他のユーザーまたは第三者の権利を侵害する行為</li>
              <li>本サービスのリバースエンジニアリング</li>
              <li>その他、運営者が不適切と判断する行為</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-white/80 mb-2">第5条（免責事項）</h2>
            <p>
              本サービスはAIにより生成されたコンテンツを提供するものであり、その正確性・完全性を保証するものではありません。本サービスの利用により生じた損害について、運営者は一切の責任を負いません。
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-white/80 mb-2">第6条（サービスの変更・終了）</h2>
            <p>
              運営者は、事前の通知なく本サービスの内容を変更、または提供を終了することができるものとします。
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-white/80 mb-2">第7条（規約の変更）</h2>
            <p>
              運営者は、必要に応じて本規約を変更できるものとします。変更後の規約は、本サービス上に掲載した時点で効力を生じるものとします。
            </p>
          </section>

          <p className="text-white/30 text-xs pt-4">2026年3月25日 制定</p>
        </div>
      </div>
    </div>
  );
}
