import Footer from '@/components/Footer/Footer';
import Header from '@/components/Header/Header';
import ChatWindowSection from '@/sections/ChatWindowSection';
import { useComplaintWizard } from '@/stores/useComplaintWizard';
import React from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

const ComplaintChatPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const complaintId = Number(id);

  // offense는 스토어에서 가져오거나, 쿼리스트링으로 넘겼다면 거기서 꺼내도 됨.
  const [sp] = useSearchParams();
  const offenseFromQS = sp.get('offense') || undefined;
  const offenseFromStore = useComplaintWizard((s) => s.state.offense) || undefined;

  const offense = offenseFromQS ?? offenseFromStore ?? undefined;

  if (!Number.isFinite(complaintId) || complaintId <= 0) {
    return <div className="p-8 text-center text-red-600">유효하지 않은 고소장 ID입니다.</div>;
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-white">
      <Header />
      <main className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col items-center gap-2 px-6 py-4">
        <ChatWindowSection
          complaintId={complaintId}
          {...(offense ? { offense } : {})}
          onReady={() => {}}
        />
      </main>
      <Footer />
    </div>
  );
};

export default ComplaintChatPage;
