import type { Service } from '@/types/service';
import type { Meta, StoryObj } from '@storybook/react';

import ServiceCard from './ServiceCard';

const meta = {
  title: 'Components/ServiceCard',
  component: ServiceCard,
  tags: ['autodocs'],
} satisfies Meta<typeof ServiceCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// 샘플 데이터
const sample: Service = {
  id: 'complaint',
  title: '고소장 작성하기',
  icon: 'edit_note',
  to: '/complaint',
};

export const Default: Story = {
  args: {
    service: sample,
  },
  parameters: {
    docs: {
      description: {
        story: '기본 서비스 버튼 렌더링 상태입니다.',
      },
    },
  },
};

export const Hover: Story = {
  args: {
    service: sample,
  },
  // 스토리북 인터랙션으로 :hover 상태를 재현
  play: async ({ canvasElement }) => {
    const card = canvasElement.querySelector('[role="button"]') as HTMLElement;
    // mouseover 이벤트로 hover 유도
    card?.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
  },
  parameters: {
    docs: {
      description: {
        story: 'hover 시 서비스 버튼 상태입니다.',
      },
    },
  },
};

export const Focus: Story = {
  args: {
    service: sample,
  },
  play: async ({ canvasElement }) => {
    const card = canvasElement.querySelector('[role="button"]') as HTMLElement;
    card?.focus();
  },
  parameters: {
    docs: {
      description: {
        story: 'focus 시 서비스 버튼 상태입니다.',
      },
    },
  },
};
