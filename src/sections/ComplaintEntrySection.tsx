import React from 'react';

type ComplaintEntrySectionProps = {
  /** 새 고소장 처음부터 작성 */
  onNew: () => void;
  /** 임시 저장된 고소장 이어쓰기 (목록으로 보내서 선택하게 할 용도) */
  onResumeDrafts: () => void;
  /** 내 고소장 전체 목록 보기 */
  onList: () => void;
};

const ComplaintEntrySection: React.FC<ComplaintEntrySectionProps> = ({
  onNew,
  onResumeDrafts,
  onList,
}) => {
  return (
    <section className="mt-10 flex flex-col gap-4">
      <h1 className="text-heading-3-bold mb-2 text-neutral-900">어떻게 고소장을 작성할까요?</h1>
      <p className="text-body-3-regular mb-4 text-neutral-600">
        새로 고소장을 작성하거나, 이전에 작성하던 고소장을 이어서 작성할 수 있어요.
      </p>

      <div className="flex flex-col gap-3">
        {/* 새 고소장 작성 */}
        <button
          type="button"
          onClick={onNew}
          className="rounded-200 border-primary-300 bg-primary-25 hover:border-primary-500 flex items-center justify-between border px-4 py-3 text-left"
        >
          <div>
            <p className="text-body-2-bold text-neutral-900">새 고소장 작성하기</p>
            <p className="text-caption-regular text-neutral-600">
              처음부터 차근차근 안내를 받아 고소장을 작성합니다.
            </p>
          </div>
          <span className="material-symbols-outlined text-primary-400">arrow_forward</span>
        </button>

        {/* 임시 저장 이어쓰기 */}
        <button
          type="button"
          onClick={onResumeDrafts}
          className="rounded-200 bg-neutral-0 hover:border-primary-300 flex items-center justify-between border border-neutral-200 px-4 py-3 text-left"
        >
          <div>
            <p className="text-body-2-bold text-neutral-900">임시 저장된 고소장 이어 작성하기</p>
            <p className="text-caption-regular text-neutral-600">
              작성 중이던 고소장을 선택해서, 이어서 AI 상담을 진행합니다.
            </p>
          </div>
          <span className="material-symbols-outlined text-neutral-500">arrow_forward</span>
        </button>

        {/* 내 고소장 목록 */}
        <button
          type="button"
          onClick={onList}
          className="rounded-200 bg-neutral-0 flex items-center justify-between border border-neutral-200 px-4 py-3 text-left hover:border-neutral-400"
        >
          <div>
            <p className="text-body-2-bold text-neutral-900">내 고소장 목록 보기</p>
            <p className="text-caption-regular text-neutral-600">
              지금까지 작성한 고소장 전체를 확인하고, 상태를 관리합니다.
            </p>
          </div>
          <span className="material-symbols-outlined text-neutral-500">list</span>
        </button>
      </div>
    </section>
  );
};

export default ComplaintEntrySection;
