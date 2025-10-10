import type { PrecheckQuestion, WizardState } from '@/types/complaint';
import { create } from 'zustand';

const initialPrechecks: PrecheckQuestion[] = [
  {
    id: 'alreadyFiled',
    title: '이 사건에 대해 고소하거나 진정한 적이 있나요?',
    hintIcon: 'info',
    confirmChip: {
      key: 'alreadyFiledNotice',
      label: '관련 안내를 확인했습니다.',
      checked: false,
    },
  },
  {
    id: 'withdrawnBefore',
    title: '이 사건에 대해 취하한 적이 있나요?',
    hintIcon: 'info',
    confirmChip: {
      key: 'withdrawnNotice',
      label: '관련 안내를 확인했습니다.',
      checked: false,
    },
  },
  {
    id: 'knowFalseAccusation',
    title: '무고죄에 대해 알고 계신가요?',
    hintIcon: 'info',
    confirmChip: {
      key: 'falseAccusationNotice',
      label: '관련 안내를 확인했습니다.',
      checked: false,
    },
  },
];

export type ComplaintWizardStore = {
  state: WizardState;
  // UI 플래그
  triedNext: boolean;

  // selectors/helpers
  allChecked: () => boolean;
  percentage: () => number;

  // actions
  toggleConfirm: (questionId: string) => void;
  prev: () => void;
  next: () => void;

  // “다음” 시도 핸들러: 모두 체크면 다음 단계로, 아니면 경고만 켜기
  attemptNext: () => void;
};

export const useComplaintWizard = create<ComplaintWizardStore>((set, get) => ({
  state: {
    step: 0,
    stepsTotal: 10,
    prechecks: initialPrechecks,
  },
  triedNext: false,

  allChecked: () => get().state.prechecks.every((q) => q.confirmChip.checked),

  toggleConfirm: (questionId: string) => {
    set(({ state }) => ({
      triedNext: false, // 사용자가 체크를 바꾸면 경고 숨김
      state: {
        ...state,
        prechecks: state.prechecks.map((q) =>
          q.id === questionId
            ? { ...q, confirmChip: { ...q.confirmChip, checked: !q.confirmChip.checked } }
            : q,
        ),
      },
    }));
  },

  // 기존 next (다른 단계에서 바로 다음으로 쓸 수도 있게 유지)
  next: () =>
    set(({ state }) => ({
      state: { ...state, step: Math.min(state.step + 1, state.stepsTotal - 1) },
    })),

  // 이전
  prev: () =>
    set(({ state }) => ({
      state: { ...state, step: Math.max(state.step - 1, 0) },
    })),

  // “다음” 시도: 모두 체크면 next, 아니면 경고 표시만
  attemptNext: () => {
    if (get().allChecked()) {
      set({ triedNext: false });
      get().next();
    } else {
      set({ triedNext: true });
    }
  },

  percentage: () => {
    const { step, stepsTotal } = get().state;
    if (stepsTotal <= 1) return 0;
    return Math.round(((step + 1) / stepsTotal) * 100);
  },
}));
