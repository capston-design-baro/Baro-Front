import CrimeTypeSection from '@/features/crime-types/pages/CrimeTypeSection';
import Footer from '@/shared/ui/Footer';
import Header from '@/shared/ui/Header';
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
