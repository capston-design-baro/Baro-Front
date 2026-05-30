import React, { useState } from 'react';

import Button from '@/shared/ui/common/Button';

/**
 * 첫 방문(또는 매일 첫 방문) 시 서비스 이용 범위를 안내하는 공지 모달.
 *
 * 현재 '사기' 유형 고소장 초안만 지원한다는 "기능 범위"를 알려 오해를 막고,
 * 동시에 면책(법률 자문이 아님)을 한 번 더 고지해 변호사법 리스크를 낮춘다.
 */
const STORAGE_KEY = 'baro:notice:scope:hideUntil';

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

const ServiceNoticeModal: React.FC = () => {
  const [open, setOpen] = useState(() => {
    try {
      // "오늘 하루 보지 않기"로 오늘 날짜가 저장돼 있으면 숨김
      return localStorage.getItem(STORAGE_KEY) !== todayKey();
    } catch {
      return true;
    }
  });

  if (!open) return null;

  const hideForToday = () => {
    try {
      localStorage.setItem(STORAGE_KEY, todayKey());
    } catch {
      // localStorage 사용 불가 환경은 무시 (이번 세션만 닫힘)
    }
    setOpen(false);
  };

  return (
    <div
      className="animate-overlay-in fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/40 px-4"
      role="dialog"
      aria-modal="true"
      aria-label="서비스 이용 안내"
    >
      <div
        className={[
          'animate-pop-in relative flex w-full max-w-sm flex-col',
          'rounded-2xl bg-white',
          'px-7 py-8',
          'shadow-[0_16px_40px_rgba(15,23,42,0.2)]',
        ].join(' ')}
      >
        <h2 className="text-body-1-bold text-neutral-900">이용 전 확인해 주세요</h2>

        <div className="text-body-3-regular mt-4 flex flex-col gap-3 text-neutral-600">
          <p>
            바로는 현재{' '}
            <span className="text-body-3-bold text-neutral-900">
              '사기' 유형의 고소장 초안 작성
            </span>
            만 지원하고 있어요. 다른 범죄 유형은 준비 중이에요.
          </p>
          <p className="text-detail-regular rounded-lg bg-neutral-50 px-4 py-3 text-neutral-500">
            바로는 법률 자문이 아닌, 이용자가 직접 고소장을 작성하도록 돕는 정보 제공 도구예요.
            정확한 죄명 판단이나 법률 상담이 필요하면 변호사 등 전문가와 상담하시길 권장해요.
          </p>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <Button
            variant="secondary"
            size="md"
            fullWidth
            onClick={hideForToday}
          >
            오늘 하루 보지 않기
          </Button>
          <Button
            variant="primary"
            size="md"
            fullWidth
            onClick={() => setOpen(false)}
          >
            닫기
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ServiceNoticeModal;
