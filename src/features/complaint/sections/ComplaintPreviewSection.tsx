import React from 'react';

import IntroHeader from '@/shared/ui/IntroHeader';

type ComplaintPreviewSectionProps = {
  complaintId: number;
  content: string;
};

function renderStyledContent(text: string) {
  const lines = text.split('\n');

  return lines.map((line, idx) => {
    const trimmed = line.trim();

    if (!trimmed) {
      return (
        <div
          key={idx}
          className="h-3"
        />
      );
    }

    // 섹션 제목: [범죄 사실], [고소 이유]
    if (/^\[.+\]$/.test(trimmed)) {
      const title = trimmed.replace(/^\[|\]$/g, '');
      return (
        <div
          key={idx}
          className="mt-6 mb-3 flex items-center gap-2"
        >
          <div className="bg-primary-400 h-5 w-1 rounded-full" />
          <span className="text-body-2-bold text-neutral-900">{title}</span>
        </div>
      );
    }

    // 불릿 문단
    if (trimmed.startsWith('○')) {
      const body = trimmed.replace(/^○\s*/, '');
      return (
        <div
          key={idx}
          className="mb-2 flex items-start gap-2 pl-3"
        >
          <span className="bg-primary-300 mt-2 h-1.5 w-1.5 shrink-0 rounded-full" />
          <p className="text-body-3-regular leading-relaxed text-neutral-700">{body}</p>
        </div>
      );
    }

    // 기본 문단
    return (
      <p
        key={idx}
        className="text-body-3-regular leading-relaxed text-neutral-700"
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
      className="mx-auto flex w-full max-w-[700px] flex-1 flex-col gap-4"
    >
      <IntroHeader
        title="완성된 고소장 미리 보기"
        lines={[
          '바로가 완성한 고소장 초안이에요.',
          '모두 정확히 작성 됐는지 확인해보고, 다음으로 넘어가서 다운로드 받아 보세요.',
        ]}
        center
        showArrow
      />

      {/* 문서 카드 */}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
        {/* 카드 헤더 */}
        <div className="flex shrink-0 items-center justify-between border-b border-neutral-100 px-5 py-3">
          <div className="flex items-center gap-2">
            <span
              className="material-symbols-outlined text-primary-400"
              style={{ fontSize: '20px' }}
            >
              description
            </span>
            <span className="text-body-3-bold text-neutral-800">고소장 초안</span>
            <span className="text-detail-regular text-neutral-400">#{complaintId}</span>
          </div>
        </div>

        {/* 문서 본문 */}
        <div className="balaw-scrollbar min-h-0 flex-1 overflow-y-auto px-6 py-5">
          {renderStyledContent(content)}
        </div>
      </div>
    </section>
  );
};

export default ComplaintPreviewSection;
