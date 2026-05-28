import React, { useState } from 'react';

import SignupAccountCard from '@/features/auth/components/SignupAccountCard';
import SignupProfileCard from '@/features/auth/components/SignupProfileCard';
import type { RegisterFormValues } from '@/features/auth/types/form';

// 회원가입 단계 (1: 이메일 및 비밀번호, 2: 프로필 정보)
type Step = 1 | 2;

// 회원가입 전체 과정에서 유지되는 데이터 타입
type FormData = {
  email: string;
  password: string;
  name: string;
  city: string;
  district: string;
  town: string;
  phone: string;
};

type SignupCardProps = {
  onSignup: (values: RegisterFormValues) => Promise<void>;
};

const SignupCard: React.FC<SignupCardProps> = ({ onSignup }) => {
  // 상태 관리
  const [step, setStep] = useState<Step>(1);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    name: '',
    city: '',
    district: '',
    town: '',
    phone: '',
  });
  // 1단계에서 "다음"을 누르면 입력받은 이메일, 비밀번호를 저장하고 2단계로 이동
  const handleAccountNext = (partialData: { email: string; password: string }) => {
    setFormData((prev) => ({ ...prev, ...partialData }));
    setStep(2);
  };

  // 2단계에서 "이전"을 누르면 현재까지 입력된 정보를 저장하고 1단계로 돌아감
  const handleProfileBack = (partialData?: Partial<FormData>) => {
    if (partialData) {
      setFormData((prev) => ({ ...prev, ...partialData }));
    }
    setStep(1);
  };

  // 2단계에서 "회원가입"을 누르면 모든 정보를 취합하여 회원가입 API를 호출
  const handleProfileNext = async (partialData: {
    name: string;
    city: string;
    district: string;
    town: string;
    phone: string;
  }) => {
    // 최종 데이터 병합
    const nextData = { ...formData, ...partialData };
    setFormData(nextData);

    // API 요청을 위한 Payload 구성
    const payload: RegisterFormValues = {
      email: nextData.email,
      name: nextData.name,
      password: nextData.password,
      address: {
        city: nextData.city,
        district: nextData.district,
        town: nextData.town,
      },
      phone_number: nextData.phone,
    };

    await onSignup(payload);
  };

  return (
    <div className="w-full max-w-[460px]">
      <div
        key={step}
        className="animate-fade-in"
      >
        {step === 1 ? (
          <SignupAccountCard
            defaultValues={formData}
            onNext={handleAccountNext}
          />
        ) : (
          <SignupProfileCard
            defaultValues={formData}
            onBack={handleProfileBack}
            onNext={handleProfileNext}
          />
        )}
      </div>
    </div>
  );
};

export default SignupCard;
