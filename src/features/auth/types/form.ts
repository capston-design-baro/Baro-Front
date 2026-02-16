// 로그인 폼에서 사용하는 값
export type LoginFormValues = {
  email: string;
  password: string;
};

// 회원가입 폼에서 사용할 주소 필드 값
export type AddressFields = {
  city: string;
  district: string;
  town: string;
};

// 회원가입 폼에서 사용하는 값
export type RegisterFormValues = {
  email: string;
  name: string;
  password: string;
  address: AddressFields;
  phone_number: string;
};
