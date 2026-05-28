import { useNavigate } from 'react-router-dom';

import React from 'react';

import logoUrl from '@/assets/BaLawLogo.svg';

const FOOTER_LINKS = [
  {
    title: '서비스',
    items: [
      { label: '고소장 작성하기', to: '/complaint' },
      { label: '범죄 유형 안내', to: '/precedent' },
    ],
  },
  {
    title: '고객지원',
    items: [{ label: '자주 하는 질문', to: '/faq' }],
  },
];

const Footer: React.FC = () => {
  const year = new Date().getFullYear();
  const navigate = useNavigate();

  return (
    <footer className="w-full shrink-0 snap-end border-t border-neutral-200 bg-neutral-50">
      <div className="mx-auto w-full max-w-[1280px] px-8 pt-4 pb-2">
        {/* 상단 영역 */}
        <div className="flex flex-col gap-6 sm:flex-row sm:justify-between">
          {/* 좌측: 로고 + 슬로건 */}
          <div className="flex flex-col gap-2">
            <img
              src={logoUrl}
              alt="BaLaw 로고"
              className="h-6 w-auto cursor-pointer self-start"
              onClick={() => navigate('/')}
            />
            <p className="text-detail-regular text-neutral-400">AI 법률 서비스, 바로에서 쉽게.</p>
            <p className="text-detail-regular text-neutral-300">
              © {year} BaLaw. All rights reserved.
            </p>
          </div>

          {/* 우측: 링크 그룹 */}
          <div className="flex gap-12">
            {FOOTER_LINKS.map((group) => (
              <div
                key={group.title}
                className="flex flex-col gap-1"
              >
                <h4 className="text-detail-bold text-neutral-900">{group.title}</h4>
                {group.items.map((item) => (
                  <button
                    key={item.to}
                    type="button"
                    onClick={() => navigate(item.to)}
                    className="text-detail-regular text-left text-neutral-500 transition-colors duration-200 hover:text-neutral-900"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

Footer.displayName = 'Footer';

export default Footer;
