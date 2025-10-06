import characterUrl from '@/assets/BaLawCharacter-large.svg';
import type { Meta, StoryObj } from '@storybook/react-vite';

import WelcomeCard from './WelcomeCard';

// URL로 임포트되는 환경(기본 Vite) 가정

const meta = {
  title: 'Auth/WelcomeCard',
  component: WelcomeCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '왼쪽 프로모션(웰컴) 카드 컴포넌트입니다.',
      },
    },
  },
  // 컴포넌트 prop들이 필수 타입이라 기본 args를 채워둠
  args: {
    title: 'Welcome to BaLaw',
    imageSrc: characterUrl,
    imageAlt: 'BaLaw 캐릭터',
  },
  argTypes: {
    title: { control: 'text' },
    imageSrc: { control: 'text' },
    imageAlt: { control: 'text' },
    className: { control: 'text' },
  },
} satisfies Meta<typeof WelcomeCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
