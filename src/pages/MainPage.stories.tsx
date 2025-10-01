import type { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import MainPage from './MainPage';

const meta: Meta<typeof MainPage> = {
  title: 'Pages/MainPage',
  component: MainPage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '헤더 + 서비스 섹션 + 푸터로 구성된 메인 페이지입니다. 내비게이션은 MemoryRouter로 감쌉니다.',
      },
    },
  },
  // 스토리 렌더링을 라우터 컨텍스트로 감싸기
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/']}>
        {/* 데모용 라우트 (서비스 카드 클릭 시 이동 경로 미리 정의) */}
        <Routes>
          <Route
            path="/*"
            element={<Story />}
          />
          <Route
            path="/complaint"
            element={<div style={{ padding: 24 }}>고소장 페이지</div>}
          />
          <Route
            path="/precedent"
            element={<div style={{ padding: 24 }}>판례 페이지</div>}
          />
          <Route
            path="/faq"
            element={<div style={{ padding: 24 }}>FAQ 페이지</div>}
          />
        </Routes>
      </MemoryRouter>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof MainPage>;

export const Default: Story = {};
