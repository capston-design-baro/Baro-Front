import { create } from 'zustand';

import type {
  BinaryAnswer,
  ComplaintWizardState,
  PrecheckQuestion,
} from '@/features/complaint/types/complaint';

// 사전 확인 질문 목록
const initialPrechecks: PrecheckQuestion[] = [
  {
    id: 'alreadyCriminalFiled',
    title: '같은 사건으로 고소장을 낸 적이 있나요?',
    hintIcon: 'info',
    kind: 'binary',
    answer: null,
    description:
      '이미 같은 사건으로 고소장을 낸 적이 있다면, 경찰이나 검찰에서 "이미 처리된 사건"으로 보고 새 고소장을 받아주지 않을 수 있어요.',
  },
  {
    id: 'alreadyCivilFiled',
    title: '같은 사건으로 민사 소송을 진행한 적이 있나요?',
    hintIcon: 'info',
    kind: 'binary',
    answer: null,
    description:
      '민사 소송은 돈이나 피해 보상을 받기 위한 절차예요. 이미 진행 중이라면 고소장 접수 전에 상황을 다시 확인해보는 게 좋아요.',
  },
  {
    id: 'withdrawnBefore',
    title: '같은 사건으로 고소를 취소한 적이 있나요?',
    hintIcon: 'info',
    kind: 'binary',
    answer: null,
    description:
      '한 번 취소한 고소는 다시 접수하기 어려울 수 있어요. 해당되신다면 법률 전문가와 먼저 상담해보시는 걸 추천드려요.',
  },
  {
    id: 'knowFalseAccusation',
    title: '거짓 고소는 처벌받을 수 있어요',
    hintIcon: 'info',
    kind: 'confirm',
    confirmChip: {
      key: 'falseAccusationNotice',
      label: '확인했어요',
      checked: false,
    },
    description:
      '사실이 아닌 내용으로 다른 사람을 고소하면 "무고죄"로 오히려 본인이 처벌받을 수 있어요. 작성하시는 내용이 사실에 기반한 것인지 꼭 확인해주세요.',
  },
];

const INITIAL_STATE: ComplaintWizardState = {
  step: 0,
  stepsTotal: 9,
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

  /** 임의 단계로 점프 (이어쓰기용) */
  setStep: (step: number) => void;

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

  setStep: (step: number) =>
    set(({ state }) => ({
      state: {
        ...state,
        step: Math.min(Math.max(step, 0), state.stepsTotal - 1),
      },
    })),

  // 다음 단계로 이동을 시도해봄
  attemptNext: () => {
    const { prechecks } = get().state;

    const criminal = prechecks.find((q) => q.id === 'alreadyCriminalFiled');
    const civil = prechecks.find((q) => q.id === 'alreadyCivilFiled');
    const withdrawn = prechecks.find((q) => q.id === 'withdrawnBefore');

    // 형사 / 민사 / 취하 질문 중 하나라도 "예"면 다음 단계 막고 툴팁 타깃 지정
    if (criminal?.answer === 'yes' || civil?.answer === 'yes' || withdrawn?.answer === 'yes') {
      set({
        triedNext: true,
        blockedPrecheckId:
          criminal?.answer === 'yes'
            ? criminal.id
            : civil?.answer === 'yes'
              ? civil.id
              : (withdrawn?.id ?? null),
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
    return Math.round((step / (stepsTotal - 1)) * 100);
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
