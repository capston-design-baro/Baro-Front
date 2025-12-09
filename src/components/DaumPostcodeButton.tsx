import React, { useState } from 'react';

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
};

const DaumPostcodeButton: React.FC<Props> = ({ onSelect }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);

    new window.daum.Postcode({
      oncomplete: (data: DaumPostcodeResult) => {
        // 선택 완료 시 콜백
        onSelect(data);
        setOpen(false);
      },
      onclose: () => {
        setOpen(false);
      },
    }).open();
  };

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className={[
          'rounded-200 text-detail-regular h-8 border px-3',
          'border-primary-400 bg-primary-0/50 hover:bg-primary-50/50',
          'active:bg-primary-100 active:border-primary-200 active:text-primary-700',
          'transition-all active:scale-95',
        ].join(' ')}
      >
        주소 찾기
      </button>

      {/* open=true일 때 모달/오버레이로 띄우고 싶으면 여기서 다룸 */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          {/* 실제로는 daum.Postcode().embed() 쓰면 커스텀 모달에 임베드도 가능 */}
          <div className="rounded-200 text-detail-regular bg-white p-4">
            주소 검색창을 여는 중입니다...
          </div>
        </div>
      )}
    </>
  );
};

export default DaumPostcodeButton;
