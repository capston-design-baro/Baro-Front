import { deleteComplaint, getMyComplaints } from '@/apis/complaints';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
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
        complaintId: c.id, // 어떤 고소장인지
        aiSessionId: c.ai_session_id ?? null, // 어떤 AI 세션인지
        status: c.status,
      },
    });
  };

  // 4) 내용 보기
  const handleView = (c: MyComplaintItem) => {
    navigate('/complaint', {
      state: {
        complaintId: c.id,
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
    <div className="flex min-h-screen w-full flex-col bg-white">
      <Header />

      <main className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col px-6 py-6">
        {/* 상단 헤더 영역 */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-heading-3-bold text-neutral-900">내 고소장 목록</h1>
            <p className="text-body-3-regular mt-1 text-neutral-600">
              작성 중인 고소장과 완료된 고소장을 한 곳에서 관리할 수 있어요.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              resetWizard();
              navigate('/complaint');
            }}
            className="rounded-300 border-primary-400 bg-primary-50 text-body-3-bold text-primary-500 hover:bg-primary-100 inline-flex items-center gap-1 border px-4 py-2"
          >
            <span className="material-symbols-outlined text-primary-500">edit_document</span>새
            고소장 작성
          </button>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="rounded-200 bg-warning-50 text-body-3-regular text-warning-200 mb-4 px-4 py-3">
            {error}
          </div>
        )}

        {/* 목록 영역 */}
        <section className="rounded-200 bg-neutral-0 flex-1 border border-neutral-200 px-5 py-4">
          {loading ? (
            <p className="text-body-3-regular text-neutral-600">목록을 불러오는 중입니다...</p>
          ) : items.length === 0 ? (
            <div className="flex h-40 flex-col items-center justify-center gap-2">
              <p className="text-body-3-regular text-neutral-600">아직 작성한 고소장이 없어요.</p>
              <button
                type="button"
                onClick={() => {
                  resetWizard();
                  navigate('/complaint');
                }}
                className="rounded-300 border-primary-400 bg-primary-50 text-body-3-bold text-primary-500 hover:bg-primary-100 inline-flex items-center gap-1 border px-4 py-2"
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
                    className="rounded-200 bg-neutral-0 flex items-center justify-between border border-neutral-200 px-4 py-3"
                  >
                    <div className="flex flex-1 flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-body-3-bold text-neutral-900">고소장 #{c.id}</span>
                        {c.crime_type && (
                          <span className="rounded-200 text-caption-regular bg-neutral-50 px-2 py-0.5 text-neutral-600">
                            {c.crime_type}
                          </span>
                        )}
                      </div>
                      <p className="text-caption-regular text-neutral-500">
                        생성일시: {formatDate(c.created_at)}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
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
                          className="rounded-300 border-primary-400 bg-primary-50 text-caption-regular text-primary-500 hover:bg-primary-100 inline-flex items-center gap-1 border px-3 py-1.5 font-semibold"
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
                          className="rounded-300 bg-neutral-0 text-caption-regular inline-flex items-center gap-1 border border-neutral-300 px-3 py-1.5 font-semibold text-neutral-700 hover:border-neutral-500"
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
                        className="rounded-300 bg-neutral-0 text-caption-regular hover:border-warning-200 hover:text-warning-200 inline-flex items-center gap-1 border border-neutral-200 px-3 py-1.5 text-neutral-500 disabled:opacity-50"
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
