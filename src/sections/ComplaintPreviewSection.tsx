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
        'flex flex-col items-center justify-start',
        'w-full max-w-[720px]',
        'bg-neutral-0',
      ].join(' ')}
    >
      <div className="w-full">
        <h2 className="text-heading-3-bold text-neutral-900">완성된 고소장 미리보기</h2>
        <p className="text-body-3-regular mt-2 text-neutral-600">
          아래 내용은 AI가 초안으로 작성한 고소장입니다. 필요한 부분은 이후 단계에서 수정·보완할 수
          있습니다.
        </p>
      </div>

      <div
        className={[
          'mt-4 h-[420px] w-full',
          'rounded-200 bg-neutral-0 overflow-y-auto border border-neutral-200',
          'px-5 py-4',
        ].join(' ')}
      >
        <pre className="text-body-3-regular whitespace-pre-wrap text-neutral-800">{content}</pre>
      </div>
    </section>
  );
};

export default ComplaintPreviewSection;
