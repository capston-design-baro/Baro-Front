import React, { useState } from 'react';

import characterUrl from '@/assets/BaLawCharacter-large.svg';

import Button from '@/shared/ui/common/Button';

import { downloadComplaintDocx } from '@/features/complaint/apis/complaints';

type ComplaintDownloadSectionProps = {
  complaintId: number;
};

const ComplaintDownloadSection: React.FC<ComplaintDownloadSectionProps> = ({ complaintId }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      await downloadComplaintDocx(complaintId);
      setDownloaded(true);
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
      className="mx-auto flex w-full max-w-[520px] flex-1 flex-col items-center justify-center gap-6"
    >
      {/* 캐릭터 + 말풍선 */}
      <div className="flex flex-col items-center gap-3">
        <img
          src={characterUrl}
          alt="바로 캐릭터"
          className="animate-pop-in h-28 w-28 md:h-36 md:w-36"
          draggable={false}
        />
        <div className="animate-bubble-up border-primary-100 bg-primary-0/40 rounded-2xl border px-6 py-4 text-center">
          <p className="text-body-2-bold md:text-body-1-bold text-neutral-800">
            {downloaded ? '다운로드가 완료됐어요!' : '고소장이 완성됐어요!'}
          </p>
          <p className="text-body-3-regular md:text-body-2-regular mt-1 text-neutral-500">
            {downloaded
              ? '파일을 열어서 내용을 확인해보세요.'
              : 'Word 파일로 다운로드해서 확인하고 제출해보세요.'}
          </p>
        </div>
      </div>

      {/* 다운로드 카드 */}
      <div className="w-full rounded-2xl border border-neutral-200 bg-white shadow-sm">
        {/* 파일 정보 */}
        <div className="flex items-center gap-4 border-b border-neutral-100 px-5 py-4">
          <div className="bg-primary-100 flex h-12 w-12 items-center justify-center rounded-xl">
            <span
              className="material-symbols-outlined text-primary-500"
              style={{ fontSize: '28px' }}
            >
              description
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-body-3-bold text-neutral-800">고소장_{complaintId}.docx</span>
            <span className="text-detail-regular text-neutral-400">Word 문서 파일</span>
          </div>
        </div>

        {/* 안내 사항 */}
        <div className="space-y-2 border-b border-neutral-100 px-5 py-4">
          <div className="flex items-start gap-2">
            <span
              className="material-symbols-outlined text-primary-300 mt-0.5"
              style={{ fontSize: '16px' }}
            >
              check_circle
            </span>
            <p className="text-detail-regular text-neutral-600">
              다운로드한 파일을 열어 내용이 정확한지 확인해주세요
            </p>
          </div>
          <div className="flex items-start gap-2">
            <span
              className="material-symbols-outlined text-primary-300 mt-0.5"
              style={{ fontSize: '16px' }}
            >
              check_circle
            </span>
            <p className="text-detail-regular text-neutral-600">
              필요하다면 문장을 수정하거나 메모를 추가할 수 있어요
            </p>
          </div>
          <div className="flex items-start gap-2">
            <span
              className="material-symbols-outlined text-primary-300 mt-0.5"
              style={{ fontSize: '16px' }}
            >
              check_circle
            </span>
            <p className="text-detail-regular text-neutral-600">
              완성된 문서를 인쇄해 제출하거나 전자문서로 보관하세요
            </p>
          </div>
        </div>

        {/* 다운로드 버튼 */}
        <div className="px-5 py-4">
          <Button
            variant={downloaded ? 'secondary' : 'primary'}
            size="lg"
            fullWidth
            onClick={handleDownload}
            disabled={isDownloading}
          >
            <span
              className="material-symbols-outlined mr-2"
              style={{ fontSize: '20px' }}
            >
              {downloaded ? 'refresh' : 'download'}
            </span>
            {isDownloading
              ? '다운로드 준비 중...'
              : downloaded
                ? '다시 다운로드'
                : 'DOCX 파일 다운로드'}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ComplaintDownloadSection;
