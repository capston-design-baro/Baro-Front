import type { Meta, StoryObj } from '@storybook/react';

import Footer from './Footer';

const meta: Meta<typeof Footer> = {
  title: 'Components/Footer',
  component: Footer,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Footer는 서비스명과 저작권 표기로 구성된 하단 바입니다.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Footer>;

export const Default: Story = {
  render: () => <Footer />,
  parameters: {
    docs: {
      description: {
        story: '저작권 표기만 포함된 기본 푸터 렌더링 상태입니다.',
      },
    },
  },
};
