import type { Meta, StoryObj } from '@storybook/react';

import Header from './Header';

const meta: Meta<typeof Header> = {
  title: 'Components/Header',
  component: Header,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Header>;

export const Default: Story = {
  render: () => <Header />,
  parameters: {
    docs: {
      description: {
        story: '기본 Header 렌더링 상태입니다. 좌측 로고, 우측 로그인 버튼으로 구성됩니다.',
      },
    },
  },
};
