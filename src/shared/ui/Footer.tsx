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
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:gap-6">
          {/* 좌측: 로고 + 면책 + 저작권 */}
          <div className="flex flex-col gap-2">
            <img
              src={logoUrl}
              alt="BaLaw 로고"
              className="h-6 w-auto cursor-pointer self-start"
              onClick={() => navigate('/')}
            />

            {/* 모바일 전용: 그룹 헤더 없이 링크를 한 줄로 압축 */}
            <nav className="flex flex-wrap gap-x-4 gap-y-1 sm:hidden">
              {FOOTER_LINKS.flatMap((group) => group.items).map((item) => (
                <button
                  key={item.to}
                  type="button"
                  onClick={() => navigate(item.to)}
                  className="text-detail-regular text-neutral-500 transition-colors duration-200 hover:text-neutral-900"
                >
                  {item.label}
                </button>
              ))}
            </nav>

            <p className="text-detail-regular max-w-[420px] text-neutral-300">
              바로는 법률 자문이 아닌, 직접 작성을 돕는 정보 제공 도구입니다.
            </p>
            <p className="text-detail-regular text-neutral-300">
              © {year} BaLaw. All rights reserved.
            </p>
          </div>

          {/* 우측: 데스크탑 전용 그룹 링크 */}
          <div className="hidden gap-12 sm:flex">
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
