import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="flex h-[120px] w-full flex-shrink-0 flex-grow-0 items-center justify-center bg-slate-900 text-white">
      <div className="flex w-full max-w-[1440px] flex-col justify-center gap-3 px-10">
        {/* 상단: 서비스명 + 링크 */}
        <div className="flex w-full items-center justify-between">
          <span className="text-lg font-semibold">BaLaw</span>

          <nav className="flex gap-6 text-sm text-gray-300">
            <a
              href="/terms"
              className="transition-colors hover:text-white"
            >
              이용약관
            </a>
            <a
              href="/privacy"
              className="transition-colors hover:text-white"
            >
              개인정보처리방침
            </a>
            <a
              href="/contact"
              className="transition-colors hover:text-white"
            >
              연락처
            </a>
          </nav>
        </div>

        {/* 하단: 저작권 */}
        <div className="text-sm text-gray-400">
          © {new Date().getFullYear()} BaLaw. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
