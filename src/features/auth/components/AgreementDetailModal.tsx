import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';

import React from 'react';

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
      className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/40 px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="agreement-modal-title"
      onClick={onClose}
    >
      <div
        className={[
          'flex flex-col',
          'max-h-[70vh] w-full max-w-md',
          'rounded-[16px] bg-white',
          'shadow-[0_8px_30px_rgba(0,0,0,0.12)]',
          'overflow-hidden',
        ].join(' ')}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <header className="flex items-center justify-between px-6 py-2">
          <h2
            id="agreement-modal-title"
            className="text-body-3-bold text-neutral-900"
          >
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-6 w-6 items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
          >
            <span className="material-symbols-outlined !text-[16px]">close</span>
          </button>
        </header>

        {/* 본문 */}
        <div className="balaw-scrollbar prose prose-slate prose-sm max-w-none overflow-y-auto border-t border-neutral-100 px-6 py-5">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeSanitize]}
          >
            {content}
          </ReactMarkdown>
        </div>

        {/* 푸터 */}
        <footer className="border-t border-neutral-100 px-6 py-4">
          <button
            type="button"
            onClick={() => {
              onToggleCheck();
              setTimeout(onClose, 400);
            }}
            className={[
              'flex w-full items-center justify-center gap-2 rounded-300 py-2.5',
              'transition-all duration-200',
              checked
                ? 'bg-primary-0 text-primary-400'
                : 'bg-neutral-50 text-neutral-500 hover:bg-neutral-100',
            ].join(' ')}
          >
            <span
              className={[
                'material-symbols-outlined !text-[20px] transition-colors duration-200',
                checked ? 'text-primary-400' : 'text-neutral-400',
              ].join(' ')}
            >
              {checked ? 'check_circle' : 'radio_button_unchecked'}
            </span>
            <span className="text-body-3-bold">
              {baseTitle}에 동의합니다
            </span>
          </button>
        </footer>
      </div>
    </div>
  );
};

export default AgreementDetailModal;
