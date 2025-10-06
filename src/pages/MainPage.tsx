import Footer from '@/components/Footer/Footer';
import Header from '@/components/Header/Header';
import ServiceSection from '@/sections/ServiceSection/ServiceSection';
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
