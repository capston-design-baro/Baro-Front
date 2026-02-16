// 로그인 요청
export type LoginRequestDto = {
  email: string;
  password: string;
};

// 로그인 응답
export type LoginResponseDto = {
  access_token: string;
  refresh_token: string;
  token_type: 'bearer';
};

// 회원가입 요청
export type RegisterRequestDto = {
  email: string;
  name: string;
  password: string;
  address: string;
  phone_number: string;
};

// 회원가입 응답
export type UserResponseDto = {
  id: number;
  email: string;
  name: string;
  address: string;
  phone_number: string;
  created_at: string;
};
