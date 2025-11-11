import Footer from '@/components/Footer';
import Header from '@/components/Header';
import FaqSection from '@/sections/FaqSection';
import React from 'react';

const FaqPage: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="flex-1">
        {/* 위쪽 여백 살짝 주고 */}
        <div className="mt-10">
          <FaqSection />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FaqPage;
