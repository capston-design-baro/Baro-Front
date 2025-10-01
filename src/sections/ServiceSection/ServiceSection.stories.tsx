import type { Meta, StoryObj } from '@storybook/react';

import ServiceSection from './ServiceSection';

const meta: Meta<typeof ServiceSection> = {
  title: 'Pages/ServiceSection',
  component: ServiceSection,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '메인 섹션: 제목/설명과 함께 3개의 ServiceCard 그리드로 구성됩니다.',
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof ServiceSection>;

export const Default: Story = { args: {} };
