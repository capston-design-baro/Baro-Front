import React from 'react';

import Footer from '@/shared/ui/Footer';
import Header from '@/shared/ui/Header';

import CrimeTypeSection from '@/features/crime-types/pages/CrimeTypeSection';

const PrecedentPage: React.FC = () => {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-neutral-50">
      <Header />
      <main className="flex-1 overflow-y-auto scroll-smooth">
        <CrimeTypeSection />
      </main>
      <Footer />
    </div>
  );
};

export default PrecedentPage;
