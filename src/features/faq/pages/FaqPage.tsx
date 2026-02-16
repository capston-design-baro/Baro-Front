import React from 'react';

import Footer from '@/shared/ui/Footer';
import Header from '@/shared/ui/Header';

import FaqSection from '@/features/faq/sections/FaqSection';

const FaqPage: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="flex-1">
        <FaqSection />
      </main>
      <Footer />
    </div>
  );
};

export default FaqPage;
