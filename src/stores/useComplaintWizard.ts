import type { BinaryAnswer, ComplaintWizardState, PrecheckQuestion } from '@/types/complaint';
import { create } from 'zustand';

// 사전 확인 질문 목록
const initialPrechecks: PrecheckQuestion[] = [
  {
    id: 'alreadyFiled',
    title: '이 사건에 대해 고소하거나 진정한 적이 있나요?',
    hintIcon: 'info',
    kind: 'binary',
    answer: null,
    description: '이미 동일한 사건으로 고소나 진정을 한 경우, 중복 접수로 처리될 수 있습니다.',
  },
  {
    id: 'withdrawnBefore',
    title: '이 사건에 대해 취하한 적이 있나요?',
    hintIcon: 'info',
    kind: 'binary',
    answer: null,
    description:
      '이전에 같은 사건을 취하한 이력이 있는 경우, 다시 고소하는 데 제한이 있을 수 있습니다.',
  },
  {
    id: 'knowFalseAccusation',
    title: '무고죄에 대해 알고 계신가요?',
    hintIcon: 'info',
    kind: 'confirm',
    confirmChip: {
      key: 'falseAccusationNotice',
      label: '관련 안내를 확인했습니다.',
      checked: false,
    },
    description: '사실이 아닌 내용을 고의로 신고할 경우 무고죄로 처벌될 수 있습니다.',
  },
];

const INITIAL_STATE: ComplaintWizardState = {
  step: 0,
  stepsTotal: 10,
  prechecks: initialPrechecks,
  offense: null,
};

export type ComplaintWizardStore = {
  // 마법사 전역 상태 -> 현재 단계, 총 단계 수, 사전확인 질문들 등
  state: ComplaintWizardState;

  setOffense: (offense: ComplaintWizardState['offense']) => void;

  // 사용자가 다음을 눌렸는지 여부
  triedNext: boolean;

  // 어떤 사전 질문 때문에 진행이 막혔는지 (툴팁 열어줄 대상)
  blockedPrecheckId: string | null;

  // 모든 질문이 충족되었는지 여부
  allChecked: () => boolean;

  // 진행률 계산
  percentage: () => number;

  // confirm 전용 확인 칩 토글
  toggleConfirm: (questionId: string) => void;

  // binary 전용 예 아니오 값 설정
  setBinaryAnswer: (questionId: string, answer: BinaryAnswer) => void;

  // 이전 단계로 이동
  prev: () => void;

  // 다음 단계로 이동
  next: () => void;

  // “다음” 시도 핸들러 -> 모두 체크면 다음 단계로, 아니면 경고만 켜기
  attemptNext: () => void;

  // 마법사 전체를 초기 상태로 되돌리기
  reset: () => void;
};

// zustand 스토어 생성
export const useComplaintWizard = create<ComplaintWizardStore>((set, get) => ({
  state: INITIAL_STATE,
  triedNext: false,
  blockedPrecheckId: null,

  // 모든 질문 충족 여부 계산
  allChecked: () => {
    const { prechecks } = get().state;
    return prechecks.every((q) =>
      q.kind === 'confirm' ? !!q.confirmChip?.checked : q.answer != null,
    );
  },

  // confirm 칩 토글 -> 사용자가 상태를 바꾸면 triedNext는 리셋되고 경고가 숨겨짐
  toggleConfirm: (questionId: string) => {
    set(({ state }) => ({
      triedNext: false,
      blockedPrecheckId: null,
      state: {
        ...state,
        prechecks: state.prechecks.map((q) =>
          q.id === questionId && q.kind === 'confirm' && q.confirmChip
            ? { ...q, confirmChip: { ...q.confirmChip, checked: !q.confirmChip.checked } }
            : q,
        ),
      },
    }));
  },

  // 예 / 아니오 선택 -> 변경 시 triedNext를 리셋하고 경고를 숨김
  setBinaryAnswer: (questionId: string, answer: BinaryAnswer) => {
    set(({ state }) => ({
      triedNext: false,
      blockedPrecheckId: null,
      state: {
        ...state,
        prechecks: state.prechecks.map((q) =>
          q.id === questionId && q.kind === 'binary' ? { ...q, answer } : q,
        ),
      },
    }));
  },

  // 다음 단계로 이동
  next: () =>
    set(({ state }) => ({
      state: { ...state, step: Math.min(state.step + 1, state.stepsTotal - 1) },
    })),

  // 이전 단계로 이동
  prev: () =>
    set(({ state }) => ({
      state: { ...state, step: Math.max(state.step - 1, 0) },
    })),

  // 다음 단계로 이동을 시도해봄
  attemptNext: () => {
    const { prechecks } = get().state;

    const q1 = prechecks.find((q) => q.id === 'alreadyFiled');
    const q2 = prechecks.find((q) => q.id === 'withdrawnBefore');

    // 1, 2번 질문 중 하나라도 "예"이면 다음 단계 막고 툴팁 타깃 지정
    if (q1?.answer === 'yes' || q2?.answer === 'yes') {
      set({
        triedNext: true,
        blockedPrecheckId: q1?.answer === 'yes' ? q1.id : (q2?.id ?? null),
      });
      return;
    }

    // 모든 질문에 체크했으면 triedNext를 끄고 다음 단계로 넘어감
    if (get().allChecked()) {
      set({ triedNext: false });
      get().next();
    }
    // 체크하지 않은게 있으면 경고 노출하고 단계 이동은 안해줌
    else {
      set({ triedNext: true });
    }
  },

  // 진행률 계산
  percentage: () => {
    const { step, stepsTotal } = get().state;
    if (stepsTotal <= 1) return 0;
    return Math.round(((step + 1) / stepsTotal) * 100);
  },

  setOffense: (offense) =>
    set(({ state }) => ({
      state: { ...state, offense },
    })),

  reset: () =>
    set({
      state: INITIAL_STATE,
      triedNext: false,
      blockedPrecheckId: null,
    }),
}));
