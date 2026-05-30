import {
  CRIME_TYPES,
  type CrimeCategory,
  type CrimeSubcategory,
} from '@/features/crime-types/constants/crimeTypes';

/**
 * 고소장 작성 플로우에서 사용자가 직접 선택하는 "형사" 죄목 목록.
 *
 * 우리 서비스는 형사 고소장만 다루므로, 민사(domain: 'civil')는 제외한다.
 * (민사는 안내 페이지 /precedent 에서만 정보 제공용으로 노출)
 *
 * AI가 죄목을 "판단"하는 대신 사용자가 이 목록에서 직접 고르게 함으로써,
 * 법률 판단의 주체를 서비스가 아닌 사용자에게 둔다.
 */
export const CRIMINAL_CATEGORIES: CrimeCategory[] =
  CRIME_TYPES.find((domain) => domain.id === 'criminal')?.categories ?? [];

export type { CrimeCategory, CrimeSubcategory };

/**
 * 사용자가 고른 죄목을 complaintId 단위로 보관/복원한다.
 *
 * 죄목 선택은 AI 세션이 생성되기 "전"에 일어나므로 백엔드 채팅 히스토리에 남지 않는다.
 * 그래서 이어쓰기로 돌아왔을 때 선택 내역을 복원할 수 있도록 localStorage에 저장한다.
 */
export type SavedOffenseSelection = { category: string; offense: string };

const offenseStorageKey = (complaintId: number) => `baro:complaint:${complaintId}:offense`;

export function saveSelectedOffense(complaintId: number, selection: SavedOffenseSelection) {
  try {
    localStorage.setItem(offenseStorageKey(complaintId), JSON.stringify(selection));
  } catch {
    // localStorage를 쓸 수 없는 환경(시크릿 모드 등)은 무시
  }
}

export function loadSelectedOffense(complaintId: number): SavedOffenseSelection | null {
  try {
    const raw = localStorage.getItem(offenseStorageKey(complaintId));
    if (!raw) return null;
    return JSON.parse(raw) as SavedOffenseSelection;
  } catch {
    return null;
  }
}
