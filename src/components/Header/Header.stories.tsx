import type { Meta, StoryObj } from '@storybook/react';

import Header from './Header';

const meta: Meta<typeof Header> = {
  title: 'Components/Header',
  component: Header,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Header는 서비스 로고와 로그인 버튼으로 구성된 상단 바입니다.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Header>;

export const Default: Story = {
  render: () => <Header />,
  parameters: {
    docs: {
      description: {
        story: '기본 Header 렌더링 상태입니다.',
      },
    },
  },
};
