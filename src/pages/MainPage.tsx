import ServiceSection from '@/sections/ServiceSection/ServiceSection';
import { useNavigate } from 'react-router-dom';

export default function MainPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* 상단 헤더 배치 */}
      {/* <Header /> */}
      <ServiceSection onClickCard={(s) => s.to && navigate(s.to)} />
      {/* <Footer /> */}
    </div>
  );
}
