import Footer from '@/components/Footer';
import Header from '@/components/Header';
import FaqSection from '@/sections/FaqSection';
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
