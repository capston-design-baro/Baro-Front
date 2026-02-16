import FaqSection from '@/features/faq/sections/FaqSection';
import Footer from '@/shared/ui/Footer';
import Header from '@/shared/ui/Header';
import React from 'react';

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
