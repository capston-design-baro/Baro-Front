import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Footer from '@/components/Footer/Footer';
import Header from '@/components/Header/Header';
import IntroHeader from '@/components/Common/IntroHeader';
import { registerAccused } from '@/apis/complaints';

const ComplaintAccusedPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const complaintId = Number(id);
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [addr1, setAddr1] = useState('');
  const [addr2, setAddr2] = useState('');
  const [addr3, setAddr3] = useState('');
  const [p1, setP1] = useState('');
  const [p2, setP2] = useState('');
  const [p3, setP3] = useState('');

  const [tipOpenName, setTipOpenName] = useState(false);
  const [tipOpenAddr, setTipOpenAddr] = useState(false);
  const [tipOpenPhone, setTipOpenPhone] = useState(false);

  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);

    const address = [addr1, addr2, addr3].filter(Boolean).join(' ').trim();
    const phone = [p1, p2, p3].some((x) => !!x) // 하나라도 입력했으면
      ? [p1, p2, p3].join('-').replace(/--+/g, '-').trim()
      : '';

    try {
      setLoading(true);
      await registerAccused(complaintId, {
        accused_name: name.trim() || '모름',
        accused_address: address || '모름',
        accused_phone: phone || '모름',
      });
      // 다음 실제 단계 주소로 이동 (예: AI 세션 또는 다음 폼)
      navigate(`/complaints/${complaintId}/review`); // 필요에 맞게 경로 변경
    } catch (e: any) {
      setErr('저장에 실패했어요. 잠시 후 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-white">
      <Header />

      <main className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col px-6 py-8">
        <div className="mx-auto w-full max-w-[720px]">
          <section className="flex h-[680px] w-[720px] flex-col items-center overflow-hidden px-[110px] py-[40px]">
            <IntroHeader
              title="고소장 작성하기"
              lines={[
                '상대방에 대한 기본 정보를 작성해주세요.',
                '알고 있는 범위 내에서만 작성해도 괜찮아요.',
              ]}
              center
              showArrow
              arrowSize={24}
              arrowOpacity={0.5}
              arrowFrom="#333333"
              arrowTo="#2563EB"
            />

            <form
              onSubmit={submit}
              className="mt-6 flex w-[420px] flex-col gap-6"
            >
              {/* 이름 */}
              <div className="relative px-3">
                <label className="flex items-center justify-between gap-3">
                  <span className="w-[50px] text-center text-base font-medium text-gray-700">
                    이름
                  </span>
                  <div className="flex w-80 items-center gap-2">
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="h-12 w-full rounded-lg border border-gray-300 px-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      placeholder="모르면 비워두세요"
                    />
                    <button
                      type="button"
                      onClick={() => setTipOpenName((v) => !v)}
                      className="shrink-0 rounded-md p-1 hover:bg-gray-100"
                      aria-label="이름 입력 도움말"
                    >
                      <span className="material-symbols-outlined text-[24px] text-gray-600">
                        info
                      </span>
                    </button>
                  </div>
                </label>
                {tipOpenName && (
                  <div className="absolute right-3 mt-2 w-[320px] rounded-2xl bg-blue-600 p-3 text-white shadow-lg">
                    <p className="text-sm font-medium">
                      상대방 이름을 모르면 비워두셔도 괜찮아요. 수사기관에서 추적해 확인합니다.
                    </p>
                  </div>
                )}
              </div>

              {/* 주소 */}
              <div className="relative px-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="w-[50px] text-center text-base font-medium text-gray-700">
                    주소
                  </span>
                  <div className="flex w-80 items-center gap-2">
                    <input
                      value={addr1}
                      onChange={(e) => setAddr1(e.target.value)}
                      className="h-12 w-[100px] rounded-lg border border-gray-300 px-3"
                      placeholder="도/시"
                    />
                    <input
                      value={addr2}
                      onChange={(e) => setAddr2(e.target.value)}
                      className="h-12 w-[100px] rounded-lg border border-gray-300 px-3"
                      placeholder="시/군/구"
                    />
                    <input
                      value={addr3}
                      onChange={(e) => setAddr3(e.target.value)}
                      className="h-12 w-[100px] rounded-lg border border-gray-300 px-3"
                      placeholder="상세"
                    />
                    <button
                      type="button"
                      onClick={() => setTipOpenAddr((v) => !v)}
                      className="shrink-0 rounded-md p-1 hover:bg-gray-100"
                      aria-label="주소 입력 도움말"
                    >
                      <span className="material-symbols-outlined text-[24px] text-gray-600">
                        info
                      </span>
                    </button>
                  </div>
                </div>
                {tipOpenAddr && (
                  <div className="absolute right-3 mt-2 w-[360px] rounded-2xl bg-blue-600 p-3 text-white shadow-lg">
                    <p className="text-sm font-medium">
                      모르면 빈칸으로 두세요. 조사 과정에서 인적 사항은 확보될 수 있어요.
                    </p>
                  </div>
                )}
              </div>

              {/* 연락처 */}
              <div className="relative px-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="w-[50px] text-center text-base font-medium text-gray-700">
                    연락처
                  </span>
                  <div className="flex w-80 items-center gap-2">
                    <input
                      value={p1}
                      onChange={(e) => setP1(e.target.value.replace(/\D/g, '').slice(0, 3))}
                      className="h-12 w-[86px] rounded-lg border border-gray-300 px-3 text-center"
                      placeholder="010"
                      inputMode="numeric"
                    />
                    <span className="text-gray-500">-</span>
                    <input
                      value={p2}
                      onChange={(e) => setP2(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      className="h-12 w-[100px] rounded-lg border border-gray-300 px-3 text-center"
                      placeholder="1234"
                      inputMode="numeric"
                    />
                    <span className="text-gray-500">-</span>
                    <input
                      value={p3}
                      onChange={(e) => setP3(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      className="h-12 w-[100px] rounded-lg border border-gray-300 px-3 text-center"
                      placeholder="5678"
                      inputMode="numeric"
                    />
                    <button
                      type="button"
                      onClick={() => setTipOpenPhone((v) => !v)}
                      className="shrink-0 rounded-md p-1 hover:bg-gray-100"
                      aria-label="연락처 입력 도움말"
                    >
                      <span className="material-symbols-outlined text-[24px] text-gray-600">
                        info
                      </span>
                    </button>
                  </div>
                </div>
                {tipOpenPhone && (
                  <div className="absolute right-3 mt-2 w-[360px] rounded-2xl bg-blue-600 p-3 text-white shadow-lg">
                    <p className="text-sm font-medium">
                      연락처도 모르면 비워두셔도 됩니다. 알고 있는 범위에서만 작성해주세요.
                    </p>
                  </div>
                )}
              </div>

              {/* 에러 */}
              <div
                aria-live="polite"
                className="min-h-[24px] text-center"
              >
                {err && (
                  <p className="inline-flex items-center gap-1 text-sm font-medium text-red-600">
                    <span
                      className="material-symbols-outlined text-[18px]"
                      aria-hidden
                    >
                      cancel
                    </span>
                    {err}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-center gap-6 pt-2">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="h-12 w-[220px] rounded-2xl bg-blue-600 text-2xl font-bold text-white hover:bg-blue-700"
                >
                  이전
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="h-12 w-[220px] rounded-2xl bg-blue-600 text-2xl font-bold text-white hover:bg-blue-700 disabled:opacity-60"
                >
                  {loading ? '저장 중...' : '다음'}
                </button>
              </div>
            </form>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ComplaintAccusedPage;
