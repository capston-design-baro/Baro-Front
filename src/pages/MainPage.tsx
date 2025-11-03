import Footer from '@/components/Footer';
import Header from '@/components/Header';
import ServiceSection from '@/sections/ServiceSection';
import { useNavigate } from 'react-router-dom';

export default function MainPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="my-6 flex-1">
        <ServiceSection onClickCard={(s) => s.to && navigate(s.to)} />
      </main>
      <Footer />
    </div>
  );
}
