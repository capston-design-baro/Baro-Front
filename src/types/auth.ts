// 로그인 요청 시 필요한 데이터
export type LoginRequest = {
  email: string;
  password: string;
};

// 로그인 성공 시 반환되는 토큰
export type TokenResponse = {
  access_token: string;
  refresh_token: string;
  token_type: 'bearer';
};

// 회원가입시 필요한 데이터
export type RegisterRequest = {
  email: string;
  name: string;
  password: string;
  address: {
    city: string;
    district?: string;
    town?: string;
  };
  phone_number: string;
};

// 사용자 정보 응답
export type UserResponse = {
  id: number;
  email: string;
  name: string;
  address: string;
  phone_number: string;
};
