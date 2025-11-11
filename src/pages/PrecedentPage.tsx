import Footer from '@/components/Footer';
import Header from '@/components/Header';
import CrimeTypeSection from '@/sections/CrimeTypeSection';
import React from 'react';

const PrecedentPage: React.FC = () => {
  return (
    <div className="bg-neutral-0 flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <CrimeTypeSection />
      </main>
      <Footer />
    </div>
  );
};

export default PrecedentPage;
