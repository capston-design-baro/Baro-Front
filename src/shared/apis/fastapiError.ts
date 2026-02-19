export type FastAPIValidationError = {
  type?: string;
  loc?: string[];
  msg: string;
  input?: unknown;
  ctx?: unknown;
};

export type FastAPIErrorResponse = {
  detail: FastAPIValidationError[];
};

export function extractFromLoc(loc?: string[]): string | undefined {
  // loc 배열이 없거나 비어있는 경우
  if (!loc || loc.length === 0) return undefined;

  // loc 배열의 마지막 요소 반환
  return loc[loc.length - 1];
}
