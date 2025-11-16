import { downloadComplaintDocx } from '@/apis/complaints';
import IntroHeader from '@/components/IntroHeader';
import React, { useState } from 'react';

type ComplaintDownloadSectionProps = {
  complaintId: number;
};

const ComplaintDownloadSection: React.FC<ComplaintDownloadSectionProps> = ({ complaintId }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      await downloadComplaintDocx(complaintId);
      // 필요하면 토스트 등으로 "다운로드가 시작됐어요" 안내
    } catch (e) {
      console.error('failed to download docx', e);
      alert('DOCX 파일 다운로드에 실패했어요. 잠시 후 다시 시도해 주세요.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <section
      aria-label={`고소장 DOCX 다운로드 (ID: ${complaintId})`}
      className={[
        'flex flex-col items-center',
        'h-[680px] w-full max-w-[1000px]',
        'bg-neutral-0 pt-6 pb-6',
      ].join(' ')}
    >
      <IntroHeader
        title="고소장 DOCX 파일로 저장하기"
        lines={[
          'AI가 작성한 고소장을 Word(DOCX) 파일로 내려받을 수 있어요.',
          '다운로드 후에 내용을 직접 수정하거나 인쇄해서 사용할 수 있습니다.',
        ]}
        center
        showArrow
      />

      <div className="mt-10 flex flex-col items-center gap-4">
        <p className="text-body-3-regular text-neutral-700">
          &quot;DOCX 파일 다운로드&quot; 버튼을 누르면 브라우저에서 파일 저장 창이 열립니다.
        </p>

        <button
          type="button"
          onClick={handleDownload}
          disabled={isDownloading}
          className={[
            'mt-4 flex h-11 items-center justify-center',
            'rounded-400 bg-primary-500 px-8',
            'text-body-3-bold text-neutral-0',
            'disabled:cursor-not-allowed disabled:opacity-50',
          ].join(' ')}
        >
          {isDownloading ? '다운로드 준비 중...' : 'DOCX 파일 다운로드'}
        </button>

        <p className="text-detail-regular mt-4 text-neutral-500">
          * 브라우저 팝업 차단이 설정되어 있다면, 다운로드가 막힐 수 있어요.
        </p>
      </div>
    </section>
  );
};

export default ComplaintDownloadSection;
