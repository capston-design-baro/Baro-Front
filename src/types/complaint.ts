export type ConfirmChip = {
  key: string;
  label: string;
  checked: boolean;
};

export type PrecheckQuestion = {
  id: string;
  title: string;
  hintIcon?: 'info' | 'alert';
  confirmChip: ConfirmChip; // "~~ 관련 안내를 확인했습니다." 같은 확인 칩
};

export type WizardState = {
  step: number; // 0-based
  stepsTotal: number;
  prechecks: PrecheckQuestion[];
};
