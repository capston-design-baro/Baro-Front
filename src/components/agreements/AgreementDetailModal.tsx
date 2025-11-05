// src/components/agreement/AgreementDetailModal.tsx
import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';

type Props = {
  open: boolean;
  title: string;
  content: string;
  checked: boolean;
  onToggleCheck: () => void;
  onClose: () => void;
};

const AgreementDetailModal: React.FC<Props> = ({
  open,
  title,
  content,
  checked,
  onToggleCheck,
  onClose,
}) => {
  if (!open) return null;

  const baseTitle = title.replace(/\(\)/, '');

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/40"
      role="dialog"
      aria-modal="true"
      aria-labelledby="agreement-modal-title"
    >
      <div
        className={[
          'flex flex-col',
          'max-h-[60vh] w-full max-w-md',
          'bg-neutral-0 rounded-200 shadow-lg',
          'overflow-hidden',
        ].join(' ')}
      >
        {/* 헤더 */}
        <header
          className={[
            'flex items-center justify-between',
            'border-b border-neutral-200',
            'bg-primary-0/50',
            'px-5 py-3',
          ].join(' ')}
        >
          <h2
            id="agreement-modal-title"
            className="text-body-3-bold text-neutral-900"
          >
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className={[
              'rounded-400 border border-neutral-300',
              'px-3 py-1.5',
              'text-detail-regular text-neutral-800',
              'bg-neutral-0 hover:bg-warning-0',
            ].join(' ')}
          >
            닫기
          </button>
        </header>
        {/* 본문 */}
        <div className="prose prose-slate prose-sm max-w-none overflow-y-auto p-6">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeSanitize]}
          >
            {content}
          </ReactMarkdown>
        </div>
        {/* 푸터 */}
        <footer
          className={[
            'flex items-center justify-end gap-4',
            'border-t border-neutral-200',
            'bg-primary-0/50',
            'px-5 py-3',
          ].join(' ')}
        >
          <label className="flex cursor-pointer items-center gap-2">
            <span className="text-body-3-regular text-neutral-900">
              BaLaw {baseTitle}에 동의합니다.
            </span>
            <input
              type="checkbox"
              checked={checked}
              onChange={() => {
                onToggleCheck();
                onClose();
              }}
              className="accent-positive-200 h-4 w-4 cursor-pointer"
            />
          </label>
        </footer>
      </div>
    </div>
  );
};

export default AgreementDetailModal;
