import React from 'react';

const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    /**
     * Footer Layout
     * -----------------
     * items-end: 내부 요소들을 아래쪽으로 정렬
     * pb-4: 아래쪽에 여백 추가
     */
    <footer className="bg-primary-900 w-full">
      <div className="mx-auto flex items-end justify-center px-4 pb-4 sm:h-15 md:h-20">
        <p className="text-detail-regular text-center text-neutral-400">
          © {year} BaLaw. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

Footer.displayName = 'Footer';

export default Footer;
