import IntroHeader from '@/components/IntroHeader';
import React from 'react';

type ComplaintPreviewSectionProps = {
  complaintId: number;
  content: string;
};

const ComplaintPreviewSection: React.FC<ComplaintPreviewSectionProps> = ({
  complaintId,
  content,
}) => {
  return (
    <section
      aria-label={`고소장 미리보기 (ID: ${complaintId})`}
      className={[
        'flex flex-col items-center justify-between',
        'mx-auto h-[680px] w-full max-w-[480px]',
        'bg-neutral-0 pt-6 pb-6',
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

      <div
        className={[
          'items-center justify-center',
          'overflow-y-auto', // 세로 스크롤
          'rounded-200 bg-neutral-0 border border-neutral-200',
          'px-5 py-4',
        ].join(' ')}
      >
        <pre className="text-body-3-regular whitespace-pre-wrap text-neutral-800">{content}</pre>
      </div>
    </section>
  );
};

export default ComplaintPreviewSection;
