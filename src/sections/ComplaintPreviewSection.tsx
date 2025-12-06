import IntroHeader from '@/components/IntroHeader';
import React from 'react';

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
          className="text-body-1-bold mt-6 mb-3 text-center text-neutral-900"
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
          <p className="text-body-3-regular leading-relaxed break-words whitespace-pre-wrap text-neutral-800">
            {body}
          </p>
        </div>
      );
    }

    // 기본 문단
    return (
      <p
        key={idx}
        className="text-body-3-regular leading-relaxed break-words whitespace-pre-wrap text-neutral-800"
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
  return (
    <section
      aria-label={`고소장 미리보기 (ID: ${complaintId})`}
      className={[
        'flex flex-col items-center justify-between',
        'mx-auto h-[680px] w-full max-w-[600px]',
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
  );
};

export default ComplaintPreviewSection;
