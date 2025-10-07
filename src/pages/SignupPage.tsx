// src/pages/SignupPage.tsx
import Footer from '@/components/Footer/Footer';
import Header from '@/components/Header/Header';
import SignupCard from '@/components/auth/SignupCard';
import WelcomeCard from '@/components/auth/WelcomeCard';
import useIsMdUp from '@/hooks/useIsMdUp';

const SignupPage: React.FC = () => {
  const isMdUp = useIsMdUp();
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="flex-1">
        <div className="mx-auto w-full max-w-[1440px] px-6 py-16 md:py-20">
          <div className="flex flex-col items-center justify-center gap-8 md:flex-row md:items-stretch">
            {isMdUp && (
              <div>
                <WelcomeCard />
              </div>
            )}
            <div className="w-full md:w-[460px]">
              <SignupCard />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SignupPage;
