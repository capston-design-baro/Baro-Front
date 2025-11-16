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
        'mx-auto h-[680px] w-full max-w-[1000px]',
        'bg-neutral-0 pt-6 pb-6',
      ].join(' ')}
    >
      <IntroHeader
        title="완성된 고소장 미리 보기"
        lines={[
          '고소장 작성 전에 확인해야 할 것들이 있어요.',
          '고소장 접수가 불가능할 수도 있으니',
          '솔직하게 체크해주세요.',
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
