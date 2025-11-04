import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Pretendard', 'ui-sans-serif', 'system-ui'],
      },
      fontSize: {
        // Headings
        'heading-1': ['32px', { lineHeight: '32px', fontWeight: 500 }],
        'heading-2': ['24px', { lineHeight: '30px', fontWeight: 500 }],
        'heading-3': ['22px', { lineHeight: '28px', fontWeight: 500 }],
        'heading-4': ['20px', { lineHeight: '26px', fontWeight: 500 }],

        // Body
        'body-1-bold': ['16px', { lineHeight: '24px', fontWeight: 700 }],
        'body-1-regular': ['16px', { lineHeight: '24px', fontWeight: 400 }],
        'body-2-bold': ['14px', { lineHeight: '22px', fontWeight: 700 }],
        'body-2-regular': ['14px', { lineHeight: '22px', fontWeight: 400 }],

        // Detail
        'detail-bold': ['12px', { lineHeight: '18px', fontWeight: 700 }],
        'detail-regular': ['12px', { lineHeight: '18px', fontWeight: 400 }],
      },
      colors: {
        primary: {
          0: '#E8F0FE',
          50: '#D3E3FD',
          100: '#A7C7FA',
          150: '#7BACF7',
          200: '#4F91F4',
          300: '#307AF1',
          400: '#2563EB',
          500: '#1E4FC2',
          600: '#193F9A',
          700: '#122E70',
          800: '#0D214E',
          900: '#08152F',
          1000: '#000000',
        },
        neutral: {
          0: '#FFFFFF',
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          350: '#BFC4CA',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
        positive: {
          lightest: '#E0F2FE',
          light: '#60A5FA',
          DEFAULT: '#3B82F6',
          strong: '#2563EB',
          dark: '#1E40AF',
        },
        negative: {
          softest: '#FEF2F2',
          soft: '#FEE2E2',
          DEFAULT: '#EF4444',
          dark: '#B91C1C',
        },
      },
      borderRadius: {
        100: '3px',
        200: '5px',
        300: '7px',
        400: '12px',
      },
    },
  },
  plugins: [],
};

export default config;
