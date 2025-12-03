import { deleteComplaint, getMyComplaints } from '@/apis/complaints';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import IntroHeader from '@/components/IntroHeader';
import { useComplaintWizard } from '@/stores/useComplaintWizard';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type MyComplaintItem = {
  id: number;
  status: 'in_progress' | 'completed' | string;
  crime_type?: string | null;
  created_at: string;
  ai_session_id?: string | null;
};

const STATUS_LABEL: Record<string, string> = {
  in_progress: '작성 중',
  completed: '작성 완료',
};

const STATUS_CHIP_CLASS: Record<string, string> = {
  in_progress: 'bg-primary-50 text-primary-500 border border-primary-100',
  completed: 'bg-neutral-50 text-neutral-600 border border-neutral-200',
};

const MyComplaintsPage: React.FC = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<MyComplaintItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const resetWizard = useComplaintWizard((s) => s.reset);

  const fetchList = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMyComplaints();
      setItems(
        data.map((c) => ({
          ...c,
          status: c.status as MyComplaintItem['status'],
        })),
      );
    } catch (e) {
      console.error('failed to fetch my complaints', e);
      setError('내 고소장 목록을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return iso;
    }
  };
  // 3) 이어쓰기
  const handleResume = (c: MyComplaintItem) => {
    resetWizard();
    navigate('/complaint', {
      state: {
        mode: 'resume', // 이어쓰기 플래그
        complaintId: Number(c.id), // 어떤 고소장인지
        aiSessionId: c.ai_session_id ?? null, // 어떤 AI 세션인지
        status: c.status,
      },
    });
  };
  // 4) 내용 보기
  const handleView = (c: MyComplaintItem) => {
    navigate('/complaint', {
      state: {
        complaintId: Number(c.id),
        status: c.status,
      },
    });
  };

  const handleDelete = async (c: MyComplaintItem) => {
    if (!window.confirm('해당 고소장을 삭제하시겠어요?\n삭제 후에는 되돌릴 수 없습니다.')) return;

    try {
      setDeletingId(c.id);
      await deleteComplaint(c.id);
      await fetchList();
    } catch (e) {
      console.error('failed to delete complaint', e);
      window.alert('고소장을 삭제하지 못했어요. 잠시 후 다시 시도해 주세요.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="bg-neutral-25 flex min-h-screen w-full flex-col">
      <Header />

      <main className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col px-6 py-8">
        {/* 🔹 상단 인트로 헤더 */}
        <div className="mb-6">
          <IntroHeader
            title="내 고소장 관리"
            lines={[
              '작성 중인 고소장과 완료된 고소장을 한 곳에서 확인할 수 있어요.',
              '이어 작성하거나 내용을 확인하고, 필요 없는 고소장은 삭제할 수 있어요.',
            ]}
            center
            showArrow={false}
          />
        </div>

        {/* 🔹 오른쪽 상단 CTA 버튼 */}
        <div className="mb-4 flex justify-end">
          <button
            type="button"
            onClick={() => {
              resetWizard();
              navigate('/complaint');
            }}
            className={[
              'inline-flex items-center gap-1',
              'rounded-300 border px-4 py-2',
              'border-primary-300 bg-primary-25 text-body-3-bold text-primary-600',
              'hover:bg-primary-50 hover:border-primary-400',
              'transition-colors duration-200',
            ].join(' ')}
          >
            <span className="material-symbols-outlined text-primary-500">edit_document</span>새
            고소장 작성
          </button>
        </div>

        {/* 🔹 에러 메시지 */}
        {error && (
          <div className="rounded-200 border-warning-100 bg-warning-25 text-body-3-regular text-warning-200 mb-4 border px-4 py-3">
            {error}
          </div>
        )}

        {/* 🔹 목록 카드 전체 래퍼 */}
        <section
          className={[
            'rounded-300 bg-neutral-0 flex-1 border border-neutral-100',
            'px-5 py-5',
            'shadow-[0_8px_24px_rgba(15,23,42,0.04)]',
          ].join(' ')}
        >
          {/* 상단 리스트 헤더 (카테고리 라벨) */}
          <div className="mb-3 flex items-center justify-between border-b border-neutral-100 pb-3">
            <div className="flex flex-col gap-0.5">
              <h2 className="text-body-2-bold text-neutral-900">내 고소장 목록</h2>
              <p className="text-caption-regular text-neutral-500">
                총 {items.length}건의 고소장이 있어요.
              </p>
            </div>
          </div>

          {/* 본문 */}
          {loading ? (
            <div className="flex h-40 items-center justify-center">
              <p className="text-body-3-regular text-neutral-600">
                고소장 목록을 불러오는 중입니다...
              </p>
            </div>
          ) : items.length === 0 ? (
            <div className="flex h-52 flex-col items-center justify-center gap-3">
              <span className="material-symbols-outlined text-[40px] text-neutral-300">drafts</span>
              <p className="text-body-3-regular text-neutral-600">아직 작성한 고소장이 없어요.</p>
              <button
                type="button"
                onClick={() => {
                  resetWizard();
                  navigate('/complaint');
                }}
                className={[
                  'inline-flex items-center gap-1',
                  'rounded-300 border px-4 py-2',
                  'border-primary-300 bg-primary-25 text-body-3-bold text-primary-600',
                  'hover:bg-primary-50 hover:border-primary-400',
                  'transition-colors duration-200',
                ].join(' ')}
              >
                <span className="material-symbols-outlined text-primary-500">add</span>새 고소장
                작성하러 가기
              </button>
            </div>
          ) : (
            <ul className="flex flex-col gap-3">
              {items.map((c) => {
                const statusLabel = STATUS_LABEL[c.status] ?? c.status;
                const statusClass = STATUS_CHIP_CLASS[c.status] ?? 'bg-neutral-50 text-neutral-600';

                return (
                  <li
                    key={c.id}
                    className={[
                      'rounded-250 border px-4 py-3',
                      'flex flex-col gap-3 md:flex-row md:items-center md:justify-between',
                      'bg-neutral-0 border-neutral-100',
                      'hover:border-primary-50 hover:bg-primary-25/40',
                      'transition-colors duration-200',
                    ].join(' ')}
                  >
                    {/* 왼쪽: 기본 정보 */}
                    <div className="flex flex-1 flex-col gap-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-body-3-bold text-neutral-900">고소장 #{c.id}</span>
                        {c.crime_type && (
                          <span className="rounded-200 bg-neutral-25 text-caption-regular px-2 py-0.5 text-neutral-600">
                            {c.crime_type}
                          </span>
                        )}
                      </div>
                      <p className="text-caption-regular text-neutral-500">
                        생성일시&nbsp;&nbsp;{formatDate(c.created_at)}
                      </p>
                    </div>

                    {/* 오른쪽: 상태 + 액션들 */}
                    <div className="flex flex-wrap items-center gap-2 md:justify-end">
                      {/* 상태 뱃지 */}
                      <span
                        className={[
                          'rounded-300 text-caption-regular inline-flex h-7 items-center px-3',
                          statusClass,
                        ].join(' ')}
                      >
                        {statusLabel}
                      </span>

                      {/* 액션 버튼들 */}
                      {c.status === 'in_progress' ? (
                        <button
                          type="button"
                          onClick={() => handleResume(c)}
                          className={[
                            'rounded-300 inline-flex items-center gap-1 border px-3 py-1.5',
                            'border-primary-300 bg-primary-25 text-caption-regular text-primary-600 font-semibold',
                            'hover:bg-primary-50 hover:border-primary-400',
                            'transition-colors duration-200',
                          ].join(' ')}
                        >
                          <span className="material-symbols-outlined text-primary-500">
                            play_arrow
                          </span>
                          이어서 작성
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleView(c)}
                          className={[
                            'rounded-300 inline-flex items-center gap-1 border px-3 py-1.5',
                            'bg-neutral-0 text-caption-regular border-neutral-300 font-semibold text-neutral-700',
                            'hover:border-neutral-500',
                            'transition-colors duration-200',
                          ].join(' ')}
                        >
                          <span className="material-symbols-outlined text-neutral-600">
                            visibility
                          </span>
                          내용 보기
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleDelete(c)}
                        disabled={deletingId === c.id}
                        className={[
                          'rounded-300 text-caption-regular inline-flex items-center gap-1 border px-3 py-1.5',
                          'bg-neutral-0 border-neutral-200 text-neutral-500',
                          'hover:border-warning-200 hover:text-warning-200',
                          'disabled:opacity-50 disabled:hover:border-neutral-200 disabled:hover:text-neutral-500',
                          'transition-colors duration-200',
                        ].join(' ')}
                      >
                        <span className="material-symbols-outlined text-inherit">delete</span>
                        삭제
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default MyComplaintsPage;
