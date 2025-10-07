import { bootstrapAuth } from '@/apis/bootstrapAuth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import Router from './routes/Router';

// App 렌더링마다 새로 만들지 않도록 컴포넌트 밖에서 생성
const queryClient = new QueryClient();

function App() {
  React.useEffect(() => {
    // 앱 로드 시 1회 동기화
    bootstrapAuth();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </QueryClientProvider>
  );
}
export default App;
