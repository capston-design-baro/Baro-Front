import type { Meta, StoryObj } from '@storybook/react';

import LoginPrompt from './LoginPrompt';

const meta: Meta<typeof LoginPrompt> = {
  title: 'Components/LoginPrompt',
  component: LoginPrompt,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '로그인 유도가 필요한 경우 표시되는 안내 컴포넌트입니다. 안내 문구, 캐릭터 이미지, [안할래요] / [로그인] 버튼으로 구성됩니다.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof LoginPrompt>;

export const Default: Story = {
  args: {
    onCancel: () => alert('안할래요 클릭됨'),
    onLogin: () => alert('로그인 클릭됨'),
  },

  parameters: {
    docs: {
      description: {
        story: 'LoginPrompt 컴포넌트입니다.',
      },
    },
  },
};
