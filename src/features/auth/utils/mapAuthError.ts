import axios from 'axios';

import { extractFromLoc } from '@/shared/apis/fastapiError';

function mapValidationErrors(field: string) {
  switch (field) {
    case 'email':
      return '이메일';

    case 'password':
      return '비밀번호';

    case 'name':
      return '이름';

    case 'address':
      return '주소';

    case 'phone_number':
      return '전화번호';

    default:
      return field;
  }
}

export function mapAuthError(error: unknown): string {
  // 프론트 validation 에러 처리
  if (error instanceof Error) {
    switch (error.message) {
      case 'EMPTY_EMAIL':
        return '이메일을 입력해주세요.';

      case 'EMPTY_NAME':
        return '이름을 입력해주세요.';

      case 'EMPTY_PASSWORD':
        return '비밀번호를 입력해주세요.';

      case 'EMPTY_ADDRESS':
        return '주소를 입력해주세요.';

      case 'EMPTY_PHONE':
        return '전화번호를 입력해주세요.';
    }
  }

  // axios 에러 처리
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const data = error.response?.data;

    // 로그인 실패 (401)
    if (status === 401) {
      return '이메일 또는 비밀번호가 올바르지 않습니다.';
    }

    // 잘못된 요청 (400)
    if (status === 400) {
      return '요청 처리 중 오류가 발생했습니다.';
    }

    // 입력 필드 오류 (422)
    if (status === 422) {
      const detail = data?.detail;

      if (typeof detail === 'string') {
        return detail;
      }

      if (Array.isArray(detail) && detail.length > 0) {
        const fieldError = detail[0];
        const msg = fieldError.msg;

        // 서버가 한국어 메시지를 제공하면 "Value error, " 접두어만 제거 후 그대로 사용
        if (typeof msg === 'string') {
          const cleaned = msg.replace(/^Value error,\s*/, '');
          if (cleaned) return cleaned;
        }

        const fieldName = extractFromLoc(fieldError.loc);
        const fieldKoreanName = fieldName ? mapValidationErrors(fieldName) : '입력값';
        return `${fieldKoreanName}에 오류가 있습니다. 입력값을 확인해주세요.`;
      }
    }
  }

  return '오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
}
