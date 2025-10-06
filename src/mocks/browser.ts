import { setupWorker } from 'msw/browser';

import { handlers } from './handlers';

const useMSW = import.meta.env.MODE !== 'production' && import.meta.env.VITE_USE_MSW === 'true';

if (useMSW) {
  const { worker } = await import('@/mocks/browser');
  await worker.start({
    onUnhandledRequest: 'bypass', // 미정의 API는 실제 네트워크로 흘려보냄
  });
}

export const worker = setupWorker(...handlers);
