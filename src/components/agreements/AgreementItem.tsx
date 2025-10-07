import type { Agreement } from '@/types/agreement';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';

type Props = {
  data: Agreement;
  onToggleCheck: (id: number) => void;
};

const AgreementItem: React.FC<Props> = ({ data, onToggleCheck }) => {
  const { id, title, content, isChecked, required } = data;

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-slate-900">{title}</p>

      {/* 본문: 스크롤 박스 */}
      <div className="h-[120px] w-full overflow-y-auto rounded-lg border border-gray-300 bg-white p-3">
        <div className="prose prose-slate prose-sm max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeSanitize]}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>

      {/* 체크박스 */}
      <label className="flex cursor-pointer items-center justify-end gap-2 select-none">
        <span className="text-sm text-slate-900">
          BaLaw <b>{title.replace(/\s*\(.*\)$/, '')}</b>에 동의합니다.
        </span>
        <input
          type="checkbox"
          checked={isChecked}
          onChange={() => onToggleCheck(id)}
          className="h-4 w-4 accent-blue-600"
          aria-required={required}
        />
      </label>
    </div>
  );
};

export default AgreementItem;
