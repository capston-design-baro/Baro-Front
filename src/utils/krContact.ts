// 한국 주소를 3등분: 시/도, 시/군/구, 읍/면/동
export function splitAddressTo3FromString(addr: string | null | undefined) {
  const raw = (addr ?? '').trim();
  if (!raw) return { a1: '', a2: '', a3: '' };

  // 콤마/여러 공백/슬래시 등은 전부 공백 하나로 정리
  const normalized = raw.replace(/[,\s/|\\-]+/g, ' ').trim();
  if (!normalized) return { a1: '', a2: '', a3: '' };

  const m = normalized.split(' ');

  if (m) {
    return {
      a1: m[0]?.trim() ?? '',
      a2: m[1]?.trim() ?? '',
      a3: m[2]?.trim() ?? '',
    };
  }

  return { a1: '', a2: '', a3: '' };
}

// 전화번호 분할 -> 숫자 이외 제거 + 길이/지역번호(02) 케이스 처리
export function splitPhoneKR(phoneRaw: unknown) {
  const d = String(phoneRaw ?? '').replace(/\D/g, '');
  if (!d) return { p1: '', p2: '', p3: '' };

  if (d.startsWith('02')) {
    if (d.length === 9) return { p1: d.slice(0, 2), p2: d.slice(2, 5), p3: d.slice(5, 9) };
    if (d.length === 10) return { p1: d.slice(0, 2), p2: d.slice(2, 6), p3: d.slice(6, 10) };
  }

  if (d.length === 11) return { p1: d.slice(0, 3), p2: d.slice(3, 7), p3: d.slice(7, 11) };
  if (d.length === 10) return { p1: d.slice(0, 3), p2: d.slice(3, 6), p3: d.slice(6, 10) };

  return { p1: d.slice(0, 3), p2: d.slice(3, 7), p3: d.slice(7, 11) };
}
