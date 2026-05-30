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
      className="mx-auto flex w-full max-w-[640px] flex-1 flex-col gap-4"
    >
      <IntroHeader
        title="고소장 초안 미리 보기"
        lines={[
          '입력하신 내용을 바탕으로 정리한 고소장 초안이에요.',
          '내용이 정확한지 직접 확인·수정한 뒤 다음으로 넘어가 다운로드해 주세요.',
        ]}
        center
        showArrow
      />

      {/* 면책 고지 */}
      <p className="text-detail-regular rounded-lg bg-neutral-50 px-4 py-3 text-center text-neutral-500">
        본 초안은 법률 자문이 아닌, 입력 내용을 정리한 참고용 문서예요. 법적 효력을 보장하지 않으니
        제출 전 내용을 직접 확인하고, 필요하면 변호사 상담을 받아보시길 권장해요.
      </p>

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
