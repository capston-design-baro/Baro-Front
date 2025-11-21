// UI Props
export type LoginCardProps = {
  className?: string;
  onLogin?: (values: LoginFormValues) => Promise<void> | void;
};

// 로그인 폼에서 사용하는 값
export type LoginFormValues = {
  email: string;
  password: string;
};

// 로그인 api에 보낼 payload
export type LoginRequestDto = {
  email: string;
  password: string;
};

// 로그인 성공 시 반환되는 토큰
export type TokenResponse = {
  access_token: string;
  refresh_token: string;
  token_type: 'bearer';
};

// 회원가입 폼에서 사용할 주소 필드 값
export type AddressFields = {
  city?: string;
  district?: string;
  town?: string;
};

// 회원가입 폼에서 사용하는 값
export type RegisterFormValues = {
  email: string;
  name: string;
  password: string;
  address?: AddressFields;
  phone_number?: string;
};

// 회원가입 api에 보낼 payload
export type RegisterRequestDto = {
  email: string;
  name: string;
  password: string;
  address: string | null;
  phone_number: string | null;
};

// 사용자 정보 응답
export type UserResponse = {
  id: number;
  email: string;
  name: string;
  address: string;
  phone_number: string;
};
