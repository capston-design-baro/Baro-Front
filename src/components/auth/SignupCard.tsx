import React, { useState } from 'react';

import SignupAccountCard from './SignupAccountCard';
import SignupProfileCard from './SignupProfileCard';

const SignupCard: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    city: '',
    district: '',
    town: '',
    phone: '',
  });

  const goNext = (partialData: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...partialData }));
    setStep(2);
  };

  const goBack = (partialData?: Partial<typeof formData>) => {
    if (partialData) setFormData((prev) => ({ ...prev, ...partialData }));
    setStep(1);
  };

  return (
    <div className="h-full w-full max-w-[460px]">
      {step === 1 ? (
        <SignupAccountCard
          defaultValues={formData}
          onNext={goNext}
        />
      ) : (
        <SignupProfileCard
          defaultValues={formData}
          onBack={goBack}
        />
      )}
    </div>
  );
};

export default SignupCard;
