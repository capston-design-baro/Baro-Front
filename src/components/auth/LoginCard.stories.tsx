import type { Meta, StoryObj } from '@storybook/react-vite';

import LoginCard from './LoginCard';

const meta = {
  title: 'Auth/LoginCard',
  component: LoginCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '로그인 폼 카드 컴포넌트. onLogin 콜백을 주입해 실제 동작을 연결할 수 있습니다.',
      },
    },
  },
  argTypes: {
    className: { control: 'text' },
    onLogin: { action: 'onLogin' }, // 액션 패널에서 호출 확인용(선택)
  },
} satisfies Meta<typeof LoginCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 기본 */
export const Default: Story = {
  args: {
    // 성공 흐름 데모용(사용자가 직접 이메일/비번 입력 후 로그인 누르면 약간의 로딩 표시)
    onLogin: async () => {
      await new Promise((r) => setTimeout(r, 500));
    },
  },
};

/** 실패 흐름(사용자가 직접 클릭해봐야 에러 배너를 확인할 수 있음) */
export const ErrorFlowManual: Story = {
  args: {
    onLogin: async () => {
      await new Promise((r) => setTimeout(r, 300));
      throw new Error('INVALID_CREDENTIALS');
    },
  },
  parameters: {
    docs: {
      description: {
        story: '이메일/비밀번호를 입력 후 ‘로그인’을 클릭하면 에러 배너가 나타납니다.',
      },
    },
  },
};
