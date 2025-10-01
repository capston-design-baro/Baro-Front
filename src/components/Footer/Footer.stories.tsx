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
        component: `
**Footer**는 서비스명, 주요 정책 링크(이용약관/개인정보처리방침/연락처), 저작권 표기로 구성된 하단 바입니다.

- 반응형 페이지에서는 상위 컨테이너에 \`max-w-[1440px] mx-auto px-10\` 등을 적용해 중앙 정렬을 권장합니다.
- 링크는 기본적으로 \`<a>\`를 사용했지만, 라우팅을 쓰는 경우 \`react-router-dom\`의 \`<Link>\`로 교체해도 됩니다.
- 색 대비/포커스 스타일(예: \`focus-visible\`)을 통해 접근성을 유지하세요.
        `,
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
        story:
          '기본 푸터 렌더링 상태입니다. 좌측 서비스명, 우측 정책 링크, 하단 저작권 표기 구성을 확인할 수 있습니다.',
      },
    },
  },
};
