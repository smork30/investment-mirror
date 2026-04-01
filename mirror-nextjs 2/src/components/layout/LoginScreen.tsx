'use client'
export default function LoginScreen() {
  return (
    <div className="flex flex-col items-center justify-center h-screen px-6 bg-surface">
      <div className="w-14 h-14 rounded-2xl bg-primary-dim flex items-center justify-center text-3xl mb-6">🪞</div>
      <h1 className="text-2xl font-bold text-ink mb-2 tracking-tight">투자 미러</h1>
      <p className="text-sub text-sm text-center mb-10 leading-relaxed">내가 왜 틀렸는지<br/>알려주는 유일한 앱</p>
      <button className="w-full py-4 bg-primary text-white rounded-xl font-semibold text-base">
        카카오로 시작하기
      </button>
      <button className="w-full py-4 bg-bg text-ink2 rounded-xl font-medium text-base mt-3">
        이메일로 시작하기
      </button>
    </div>
  )
}
