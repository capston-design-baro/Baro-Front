import React from 'react';

import Footer from '@/shared/ui/Footer';
import Header from '@/shared/ui/Header';

import FaqSection from '@/features/faq/sections/FaqSection';

const FaqPage: React.FC = () => {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-neutral-50">
      <Header />
      <main className="flex-1 overflow-y-auto scroll-smooth">
        <FaqSection />
      </main>
      <Footer />
    </div>
  );
};

export default FaqPage;
