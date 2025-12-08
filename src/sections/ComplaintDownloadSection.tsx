import { downloadComplaintDocx } from '@/apis/complaints';
import DocxIcon from '@/assets/Docs.svg';
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
        'mx-auto flex flex-col items-center',
        'h-[600px] w-full max-w-[1000px]',
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

      <div
        className={[
          'mt-8 flex min-h-0 w-full max-w-[520px] flex-1 flex-col',
          'rounded-200 bg-neutral-0 border border-neutral-200 shadow-sm',
          'px-6 py-5',
        ].join(' ')}
      >
        {/* 상단 아이콘 + 타이틀 */}
        <div className="mb-6 flex items-center gap-3">
          <div
            className={[
              'flex h-10 w-10 items-center justify-center',
              'bg-primary-50 text-primary-500 rounded-full',
              'text-body-2-bold',
            ].join(' ')}
          >
            W
          </div>
          <div className="flex flex-col">
            <span className="text-caption-regular text-neutral-500">문서 ID #{complaintId}</span>
            <span className="text-body-2-bold text-neutral-900">
              고소장을 Word 문서로 저장할 수 있어요
            </span>
          </div>
        </div>

        {/* 안내 텍스트/단계 */}
        <div className="text-body-3-regular mb-5 space-y-2 text-neutral-700">
          <p>아래 버튼을 눌러 DOCX 파일을 내려받은 뒤, 필요에 따라 수정·보관해 주세요.</p>
          <ul className="text-caption-regular space-y-1 text-neutral-600">
            <li>1️⃣ 다운로드한 파일을 열어 내용이 정확한지 다시 한 번 확인해 주세요.</li>
            <li>2️⃣ 필요하다면 일부 문장을 직접 수정하거나 추가 메모를 남길 수 있어요.</li>
            <li>3️⃣ 완성된 문서를 인쇄해 제출하거나, 전자문서로 보관할 수 있습니다.</li>
          </ul>
        </div>

        {/* 버튼 영역 */}
        <div className="mt-auto flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={handleDownload}
            disabled={isDownloading}
            className={[
              'flex h-12 w-full items-center justify-center gap-2',
              'rounded-400 bg-primary-500 px-6',
              'text-body-3-bold text-neutral-0',
              'transition-colors',
              'hover:bg-primary-600 disabled:hover:bg-primary-500',
              'disabled:cursor-not-allowed disabled:opacity-50',
            ].join(' ')}
          >
            {/* DOCX 아이콘 */}
            <span className="bg-primary-400/15 flex h-9 w-9 items-center justify-center rounded-[12px]">
              <img
                src={DocxIcon}
                alt="DOCX 파일 아이콘"
                className="h-5 w-5"
              />
            </span>

            {isDownloading ? '다운로드 준비 중...' : 'DOCX 파일 다운로드'}
          </button>

          <p className="text-detail-regular text-neutral-500">
            * 브라우저의 팝업 차단 설정에 따라 다운로드 창이 보이지 않을 수 있어요.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ComplaintDownloadSection;
