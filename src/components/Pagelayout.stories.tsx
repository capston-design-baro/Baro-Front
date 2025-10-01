import ServiceSection from '@/sections/ServiceSection/ServiceSection';
import type { Meta, StoryObj } from '@storybook/react';

import Footer from './Footer/Footer';
import Header from './Header/Header';

const meta: Meta = {
  title: 'Layouts/PageLayout',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
**PageLayout**은 Header와 Footer를 동시에 보여주는 스토리입니다.  
중앙에는 임시 본문 영역을 추가하여 전체 페이지 레이아웃 구조를 확인할 수 있습니다.

- Header: 상단 로고 + 로그인 버튼
- Footer: 서비스명 + 정책 링크 + 저작권
- Main: 임시 컨텐츠 (placeholder)
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="flex flex-grow items-center justify-center">
        <ServiceSection />
      </main>
      <Footer />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Header와 Footer가 포함된 기본 페이지 레이아웃 구조입니다. 중앙 영역은 예시 텍스트로 채워져 있습니다.',
      },
    },
  },
};
