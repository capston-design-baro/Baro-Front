import React from 'react';

import Footer from '@/shared/ui/Footer';
import Header from '@/shared/ui/Header';

import CrimeTypeSection from '@/features/crime-types/pages/CrimeTypeSection';

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
