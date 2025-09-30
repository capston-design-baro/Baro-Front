import type { Service } from '@/types/service';
import type { Meta, StoryObj } from '@storybook/react';

import ServiceCard from './ServiceCard';

const meta = {
  title: 'Components/ServiceCard',
  component: ServiceCard,
  parameters: {
    layout: 'centered',
  },
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
};

export const Focus: Story = {
  args: {
    service: sample,
  },
  play: async ({ canvasElement }) => {
    const card = canvasElement.querySelector('[role="button"]') as HTMLElement;
    card?.focus();
  },
};

export const KeyboardActivate: Story = {
  args: {
    service: sample,
  },
  play: async ({ canvasElement }) => {
    const card = canvasElement.querySelector('[role="button"]') as HTMLElement;
    card?.focus();
    // Space/Enter 키로 onClick 트리거 되는지 확인 (Actions 패널에서 "clicked" 이벤트 확인)
    card?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    card?.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
  },
};
