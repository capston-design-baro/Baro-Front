import type { Meta, StoryObj } from '@storybook/react-vite';

import { ChatBubble } from './ChatBubble';

const meta: Meta<typeof ChatBubble> = {
  title: 'Chat/ChatBubble',
  component: ChatBubble,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div className="grid min-h-screen w-full place-items-center overflow-x-hidden">
        <div className="w-[min(100vw-2rem,720px)] px-4">
          <Story />
        </div>
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof ChatBubble>;

export const Left: Story = {
  args: {
    side: 'left',
    text: '사건이 발생한 날짜를 알려주세요.',
    time: '오전 10:00',
    srLabel: '봇',
  },
};

export const Right: Story = {
  args: { side: 'right', text: '24년 7월 12일이었어요..ㅜㅜ', time: '오전 10:01', srLabel: '나' },
};

export const LongText: Story = {
  args: {
    side: 'right',
    text: '기이이이이이이이이이이이이이이이이이이이이이이이이인 텍스트',
    time: '오전 10:05',
    srLabel: '나',
  },
};

export const ShortText: Story = {
  args: {
    side: 'left',
    text: '짧은 텍스트',
    time: '오후 11:11',
    srLabel: '봇',
  },
};
