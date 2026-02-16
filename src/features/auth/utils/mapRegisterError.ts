export function mapRegisterError(error: unknown): string {
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
      default:
        return '회원가입 중 오류가 발생했습니다.';
    }
  }

  // axios 에러 처리
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const err = error as { response?: { status: number; data?: { message?: string } } };

    if (err.response?.status === 400) {
      return err.response.data?.message || '회원가입 중 오류가 발생했습니다.';
    }

    if (err.response?.status === 422) {
      return '입력값을 확인해주세요.';
    }
  }

  return '회원가입 중 오류가 발생했습니다.';
}
