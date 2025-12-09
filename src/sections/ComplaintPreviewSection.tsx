import IntroHeader from '@/components/IntroHeader';
import React, { useState } from 'react';

type ComplaintPreviewSectionProps = {
  complaintId: number;
  content: string;
};

// 섹션 타이틀을 감지해서 스타일 적용하는 함수
function renderStyledContent(text: string) {
  const lines = text.split('\n');

  return lines.map((line, idx) => {
    const trimmed = line.trim();

    // 공백 줄 → 살짝 여백만 추가
    if (!trimmed) {
      return (
        <div
          key={idx}
          className="h-2"
        />
      );
    }

    // 섹션 제목: [범죄 사실], [고소 이유]
    if (trimmed === '[범죄 사실]' || trimmed === '[고소 이유]') {
      const title = trimmed.replace(/^\[|\]$/g, ''); // 대괄호 제거

      return (
        <div
          key={idx}
          className="text-heading-3-bold mt-6 mb-3 text-center text-neutral-900"
        >
          {title}
        </div>
      );
    }

    // 불릿 문단: "○ ..." 로 시작하는 줄
    if (trimmed.startsWith('○')) {
      const body = trimmed.replace(/^○\s*/, '');

      return (
        <div
          key={idx}
          className="mb-2 flex items-start gap-2"
        >
          <span className="text-primary-200 mt-[6px] text-[8px]">●</span>
          <p className="text-body-2-regular leading-relaxed break-words whitespace-pre-wrap text-neutral-800">
            {body}
          </p>
        </div>
      );
    }

    // 기본 문단
    return (
      <p
        key={idx}
        className="text-body-2-regular leading-relaxed break-words whitespace-pre-wrap text-neutral-800"
      >
        {line}
      </p>
    );
  });
}
const ComplaintPreviewSection: React.FC<ComplaintPreviewSectionProps> = ({
  complaintId,
  content,
}) => {
  // 전체 화면 모드 상태
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <>
      {/* 기본 미리보기 (카드 버전) */}
      <section
        aria-label={`고소장 미리보기 (ID: ${complaintId})`}
        className={[
          'balaw-scrollbar flex flex-col items-center justify-between',
          'mx-auto h-[600px] w-full max-w-[600px]',
          'bg-neutral-0 gap-5 pt-6 pb-6',
        ].join(' ')}
      >
        <IntroHeader
          title="완성된 고소장 미리 보기"
          lines={[
            '바로가 완성한 고소장 초안이에요.',
            '모두 정확히 작성 됐는지 확인해보고,',
            '다음으로 넘어가서 다운로드 받아 보세요.',
          ]}
          center
          showArrow
        />

        {/* 문서 카드 */}
        <div
          className={[
            'flex min-h-0 w-full flex-1 flex-col',
            'rounded-200 bg-neutral-0 border border-neutral-200 shadow-sm',
            'px-5 py-4',
          ].join(' ')}
        >
          {/* 카드 헤더 (ID / 상태 뱃지) */}
          <div className="mb-3 flex items-center justify-between gap-2">
            <div className="flex w-full items-center justify-between">
              <span className="text-caption-regular text-neutral-500">고소장 초안</span>
              <span className="text-body-3-bold text-neutral-900">문서 ID #{complaintId}</span>
            </div>

            {/* 전체 화면 버튼 */}
            <button
              type="button"
              onClick={() => setIsFullscreen(true)}
              className="group hover:text-primary-400 relative text-neutral-400 transition-colors"
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: '16px' }}
              >
                open_in_full
              </span>

              {/* 툴팁 */}
              <div
                className={[
                  'absolute top-full left-1/2 mt-1 -translate-x-1/2',
                  'rounded-200 bg-primary-0/50 px-2 py-1',
                  'text-detail-regular whitespace-nowrap text-neutral-500',
                  'opacity-0 transition-opacity duration-200',
                  'pointer-events-none',
                  'group-hover:opacity-100',
                ].join(' ')}
              >
                {' '}
                전체 보기
              </div>
            </button>
          </div>

          {/* 구분선 */}
          <div className="mb-3 h-px w-full bg-neutral-100" />

          {/* 실제 내용 스크롤 영역 */}
          <div
            className={[
              'relative min-h-0 flex-1',
              'overflow-y-auto',
              'pr-3', // 스크롤바 여유
            ].join(' ')}
          >
            <div className={['relative min-h-0 flex-1', 'overflow-y-auto', 'pr-3'].join(' ')}>
              {renderStyledContent(content)}
            </div>
          </div>
        </div>
      </section>

      {/* 전체 화면 모달 */}
      {isFullscreen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 px-4"
          role="dialog"
          aria-modal="true"
          aria-label="고소장 전체 화면 미리보기"
        >
          <div
            className={[
              'balaw-scrollbar flex max-h-[90vh] w-full max-w-4xl flex-col',
              'rounded-400 bg-neutral-0',
              'px-8 py-6',
              'shadow-[0_16px_40px_rgba(15,23,42,0.35)]',
            ].join(' ')}
          >
            {/* 상단 헤더 (제목 + 닫기 버튼) */}
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex flex-col">
                <span className="text-caption-regular text-neutral-500">고소장 전체 미리보기</span>
                <span className="text-body-1-bold text-neutral-900">문서 ID #{complaintId}</span>
              </div>
              <button
                type="button"
                onClick={() => setIsFullscreen(false)}
                className="hover:text-warning-300 text-neutral-400 transition-colors"
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: '16px' }}
                >
                  close
                </span>
              </button>
            </div>

            {/* 구분선 */}
            <div className="mb-4 h-px w-full bg-neutral-100" />

            {/* 내용 스크롤 영역 (더 넓고 더 높은 영역) */}
            <div className="balaw-scrollbar min-h-0 flex-1 overflow-y-auto pr-4">
              {renderStyledContent(content)}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ComplaintPreviewSection;
