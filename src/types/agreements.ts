export interface Agreement {
  id: number; // 약관 고유 ID
  isChecked: boolean; // 동의 여부
  isExpanded: boolean; // 펼침 여부
  title: string; // 약관 제목
  content: string; // 약관 본문
}
