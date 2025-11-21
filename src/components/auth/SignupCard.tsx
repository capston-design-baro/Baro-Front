import { register } from '@/apis/auth';
import type { RegisterFormValues } from '@/types/auth';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import SignupAccountCard from './SignupAccountCard';
import SignupProfileCard from './SignupProfileCard';

type Step = 1 | 2;

type FormData = {
  email: string;
  password: string;
  name: string;
  city: string;
  district: string;
  town: string;
  phone: string;
};

const SignupCard: React.FC = () => {
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

  const navigate = useNavigate();

  // 1단계에서 "다음"
  const handleAccountNext = (partialData: { email: string; password: string }) => {
    setFormData((prev) => ({ ...prev, ...partialData }));
    setStep(2);
  };

  // 2단계에서 "이전"
  const handleProfileBack = (partialData?: Partial<FormData>) => {
    if (partialData) {
      setFormData((prev) => ({ ...prev, ...partialData }));
    }
    setStep(1);
  };

  // 2단계에서 "회원가입" or "다음"
  const handleProfileNext = async (partialData: {
    name: string;
    city: string;
    district: string;
    town: string;
    phone: string;
  }) => {
    const nextData = { ...formData, ...partialData };
    setFormData(nextData);

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

    try {
      await register(payload);
      navigate('/login');
    } catch (error) {
      console.error('회원가입 실패:', error);
    }
  };

  return (
    <div className="h-full w-full max-w-[460px]">
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
  );
};

export default SignupCard;
