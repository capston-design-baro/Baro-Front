export type AuthContext = 'login' | 'register' | 'check-email' | 'token';

export function mapAuthError(error: unknown, context?: AuthContext): string {
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
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const err = error as {
      response?: {
        status: number;
        data: { detail: string | { msg: string }[] };
      };
    };
    const status = err.response?.status;

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
      // 로그인 시 422
      if (context === 'login') {
        return '이메일 형식이 잘못되었습니다.';
      }

      // 회원가입 시 422
      if (context === 'register') {
        return '이메일 형식이 잘못되었습니다.';
      }

      // 이메일 중복 체크 시 422
      if (context === 'check-email') {
        return '이메일 형식이 잘못되었습니다.';
      }

      // 그 외
      return '입력값을 확인해주세요.';
    }
  }

  return '오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
}
