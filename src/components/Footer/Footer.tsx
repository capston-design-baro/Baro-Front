import React, { memo } from 'react';

const Footer: React.FC = memo(() => {
  return (
    <footer className="flex h-[80px] w-full flex-shrink-0 flex-grow-0 items-end justify-center bg-slate-900 text-white sm:h-[100px] md:h-[120px]">
      {/* 저작권만 표시 */}
      <div className="mb-5 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} BaLaw. All rights reserved.
      </div>
    </footer>
  );
});

Footer.displayName = 'Footer';

export default Footer;
