import { useNavigate } from 'react-router-dom';

import React, { useEffect, useState } from 'react';

import characterUrl from '@/assets/BaLawCharacter-large.svg';

import CharacterModal from '@/shared/ui/CharacterModal';
import Footer from '@/shared/ui/Footer';
import Header from '@/shared/ui/Header';
import Button from '@/shared/ui/common/Button';

import {
  deleteComplaint,
  downloadComplaintDocx,
  getMyComplaints,
} from '@/features/complaint/apis/complaints';
import { useComplaintWizard } from '@/features/complaint/stores/useComplaintWizard';

type MyComplaintItem = {
  id: number;
  status: 'in_progress' | 'completed' | string;
  crime_type?: string | null;
  created_at: string;
  ai_session_id?: string | null;
};

const MyComplaintsPage: React.FC = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<MyComplaintItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MyComplaintItem | null>(null);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  const resetWizard = useComplaintWizard((s) => s.reset);

  const [filter, setFilter] = useState<'all' | 'in_progress' | 'completed'>('all');

  const filteredItems = filter === 'all' ? items : items.filter((c) => c.status === filter);

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

  const handleResume = (c: MyComplaintItem) => {
    resetWizard();
    navigate('/complaint', {
      state: {
        mode: 'resume',
        complaintId: Number(c.id),
        aiSessionId: c.ai_session_id ?? null,
        status: c.status,
      },
    });
  };

  const handleDownload = async (c: MyComplaintItem) => {
    try {
      setDownloadingId(c.id);
      await downloadComplaintDocx(c.id);
    } catch (e) {
      console.error('failed to download complaint docx', e);
      window.alert('고소장 DOCX 파일을 다운로드하지 못했어요. 잠시 후 다시 시도해 주세요.');
    } finally {
      setDownloadingId(null);
    }
  };

  const handleDelete = (c: MyComplaintItem) => {
    setDeleteTarget(c);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeletingId(deleteTarget.id);
      await deleteComplaint(deleteTarget.id);
      await fetchList();
      setDeleteTarget(null);
    } catch (e) {
      console.error('failed to delete complaint', e);
      window.alert('고소장을 삭제하지 못했어요. 잠시 후 다시 시도해 주세요.');
    } finally {
      setDeletingId(null);
    }
  };

  const inProgressCount = items.filter((c) => c.status === 'in_progress').length;
  const completedCount = items.filter((c) => c.status === 'completed').length;

  return (
    <div className="flex min-h-screen w-full flex-col bg-neutral-50">
      <Header />

      <main className="mx-auto flex w-full max-w-[800px] flex-1 flex-col px-6 py-8">
        {/* 헤더 영역 */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-heading-3-bold text-neutral-900">내 고소장</h2>
            <p className="text-body-3-regular mt-1 text-neutral-500">
              작성한 고소장을 관리할 수 있어요.
            </p>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              resetWizard();
              navigate('/complaint', { state: { mode: 'new' } });
            }}
          >
            <span
              className="material-symbols-outlined mr-1"
              style={{ fontSize: '18px' }}
            >
              add
            </span>
            새 고소장
          </Button>
        </div>

        {/* 필터 탭 */}
        {items.length > 0 && (
          <div className="mb-6 grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={[
                'rounded-xl border px-4 py-3 text-left transition-all',
                filter === 'all'
                  ? 'border-primary-400 bg-primary-0/30 shadow-sm'
                  : 'hover:border-primary-200 border-neutral-200 bg-white',
              ].join(' ')}
            >
              <p
                className={`text-detail-regular ${filter === 'all' ? 'text-primary-400' : 'text-neutral-400'}`}
              >
                전체
              </p>
              <p
                className={`text-body-1-bold ${filter === 'all' ? 'text-primary-500' : 'text-neutral-700'}`}
              >
                {items.length}건
              </p>
            </button>
            <button
              type="button"
              onClick={() => setFilter('in_progress')}
              className={[
                'rounded-xl border px-4 py-3 text-left transition-all',
                filter === 'in_progress'
                  ? 'border-primary-400 bg-primary-0/30 shadow-sm'
                  : 'hover:border-primary-200 border-neutral-200 bg-white',
              ].join(' ')}
            >
              <p
                className={`text-detail-regular ${filter === 'in_progress' ? 'text-primary-400' : 'text-neutral-400'}`}
              >
                작성 중
              </p>
              <p
                className={`text-body-1-bold ${filter === 'in_progress' ? 'text-primary-500' : 'text-neutral-700'}`}
              >
                {inProgressCount}건
              </p>
            </button>
            <button
              type="button"
              onClick={() => setFilter('completed')}
              className={[
                'rounded-xl border px-4 py-3 text-left transition-all',
                filter === 'completed'
                  ? 'border-primary-400 bg-primary-0/30 shadow-sm'
                  : 'hover:border-primary-200 border-neutral-200 bg-white',
              ].join(' ')}
            >
              <p
                className={`text-detail-regular ${filter === 'completed' ? 'text-primary-400' : 'text-neutral-400'}`}
              >
                작성 완료
              </p>
              <p
                className={`text-body-1-bold ${filter === 'completed' ? 'text-primary-500' : 'text-neutral-700'}`}
              >
                {completedCount}건
              </p>
            </button>
          </div>
        )}

        {/* 에러 메시지 */}
        {error && (
          <div className="border-warning-100 bg-warning-0 text-body-3-regular text-warning-200 mb-4 rounded-xl border px-4 py-3">
            {error}
          </div>
        )}

        {/* 목록 */}
        {loading ? (
          <div className="flex flex-1 items-center justify-center">
            <span
              className="material-symbols-outlined text-primary-300 mb-2 animate-spin"
              style={{ fontSize: '28px' }}
            >
              progress_activity
            </span>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4">
            <img
              src={characterUrl}
              alt="바로 캐릭터"
              className="h-24 w-24 opacity-60"
              draggable={false}
            />
            <p className="text-body-2-regular text-neutral-400">아직 작성한 고소장이 없어요</p>
            <Button
              variant="primary"
              size="md"
              onClick={() => {
                resetWizard();
                navigate('/complaint');
              }}
            >
              고소장 작성 시작하기
            </Button>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 py-12">
            <span
              className="material-symbols-outlined text-neutral-300"
              style={{ fontSize: '32px' }}
            >
              filter_list_off
            </span>
            <p className="text-body-3-regular text-neutral-400">
              {filter === 'in_progress'
                ? '작성 중인 고소장이 없어요'
                : '작성 완료된 고소장이 없어요'}
            </p>
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {filteredItems.map((c) => {
              const isInProgress = c.status === 'in_progress';
              const createdTime = new Date(c.created_at).getTime();
              const canDownload =
                c.status === 'completed' && Date.now() - createdTime <= 24 * 60 * 60 * 1000;

              return (
                <li
                  key={c.id}
                  className="group hover:border-primary-200 rounded-2xl border border-neutral-200 bg-white px-5 py-4 shadow-sm transition-all duration-200 hover:shadow-md"
                >
                  {/* 상단: 정보 */}
                  <div className="mb-3 flex items-start justify-between">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span
                          className="material-symbols-outlined text-primary-400"
                          style={{ fontSize: '20px' }}
                        >
                          {isInProgress ? 'edit_note' : 'task'}
                        </span>
                        <span className="text-body-3-bold text-neutral-800">고소장 #{c.id}</span>
                        <span
                          className={[
                            'text-detail-regular rounded-full px-2 py-0.5',
                            isInProgress
                              ? 'bg-primary-0 text-primary-400'
                              : 'bg-neutral-100 text-neutral-500',
                          ].join(' ')}
                        >
                          {isInProgress ? '작성 중' : '작성 완료'}
                        </span>
                      </div>
                      {c.crime_type && (
                        <span className="text-detail-regular pl-7 text-neutral-500">
                          {c.crime_type}
                        </span>
                      )}
                    </div>
                    <span className="text-detail-regular text-neutral-400">
                      {formatDate(c.created_at)}
                    </span>
                  </div>

                  {/* 하단: 액션 */}
                  <div className="flex items-center justify-end gap-2 border-t border-neutral-100 pt-3">
                    {isInProgress ? (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleResume(c)}
                      >
                        <span
                          className="material-symbols-outlined mr-1"
                          style={{ fontSize: '16px' }}
                        >
                          play_arrow
                        </span>
                        이어 쓰기
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => canDownload && handleDownload(c)}
                        disabled={!canDownload || downloadingId === c.id}
                      >
                        <span
                          className="material-symbols-outlined mr-1"
                          style={{ fontSize: '16px' }}
                        >
                          download
                        </span>
                        {canDownload
                          ? downloadingId === c.id
                            ? '다운로드 중...'
                            : '다운로드'
                          : '기간 만료'}
                      </Button>
                    )}
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleDelete(c)}
                      disabled={deletingId === c.id}
                    >
                      <span
                        className="material-symbols-outlined mr-1"
                        style={{ fontSize: '16px' }}
                      >
                        delete
                      </span>
                      삭제
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </main>

      {deleteTarget && (
        <div
          className="animate-overlay-in fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/40 px-4"
          onClick={() => setDeleteTarget(null)}
        >
          <div
            className="animate-pop-in"
            onClick={(e) => e.stopPropagation()}
          >
            <CharacterModal
              variant="delete"
              onCancel={() => setDeleteTarget(null)}
              onConfirm={confirmDelete}
            />
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default MyComplaintsPage;
