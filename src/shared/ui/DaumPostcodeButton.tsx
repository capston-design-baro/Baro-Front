import React, { useState } from 'react';

import Button from '@/shared/ui/common/Button';

declare global {
  interface Window {
    daum: {
      Postcode: new (options: {
        oncomplete: (data: DaumPostcodeResult) => void;
        onclose?: () => void;
      }) => {
        open: () => void;
        embed?: (container: HTMLElement) => void;
      };
    };
  }
}

export type DaumPostcodeResult = {
  zonecode: string; // 우편번호
  roadAddress: string; // 도로명 주소
  jibunAddress: string; // 지번 주소
  sido: string; // 시/도 (서울특별시, 경기도 등)
  sigungu: string; // 시/군/구
  bname: string; // 법정동/읍/면 이름
};

type Props = {
  onSelect: (data: DaumPostcodeResult) => void;
  address?: { city: string; district: string; town: string };
};

const DaumPostcodeButton: React.FC<Props> = ({ onSelect, address }) => {
  const [isOpening, setIsOpening] = useState(false);

  const hasAddress = address && (address.city || address.district || address.town);

  const handleOpen = () => {
    setIsOpening(true);

    new window.daum.Postcode({
      oncomplete: (data: DaumPostcodeResult) => {
        onSelect(data);
        setIsOpening(false);
      },
      onclose: () => {
        setIsOpening(false);
      },
    }).open();
  };

  // 주소 선택 완료 상태
  if (hasAddress) {
    return (
      <div className="rounded-200 border-primary-200 bg-primary-0/50 flex h-8 w-full items-center gap-3 border px-3">
        <span className="text-body-3-regular flex-1 text-neutral-900">
          {[address.city, address.district, address.town].filter(Boolean).join(' ')}
        </span>
        <Button
          type="button"
          variant="outline"
          size="xs"
          onClick={handleOpen}
        >
          변경
        </Button>
      </div>
    );
  }

  // 빈 상태: 클릭 유도 카드
  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className="rounded-200 hover:border-primary-300 hover:bg-primary-0/30 flex h-8 w-full items-center gap-3 border border-dashed border-neutral-300 px-3 text-left transition-colors"
      >
        <span
          className="material-symbols-outlined text-neutral-400"
          style={{ fontSize: '20px' }}
        >
          search
        </span>
        <span className="text-body-3-regular text-neutral-400">주소를 검색해주세요</span>
      </button>

      {isOpening && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="rounded-200 text-detail-regular bg-white p-4">
            주소 검색창을 여는 중입니다...
          </div>
        </div>
      )}
    </>
  );
};

export default DaumPostcodeButton;
