import React, { useState } from 'react';

const SignupProfileCard: React.FC<{
  defaultValues: any;
  onBack: (data?: any) => void;
}> = ({ defaultValues, onBack }) => {
  const [name, setName] = useState(defaultValues.name);
  const [city, setCity] = useState(defaultValues.city);
  const [district, setDistrict] = useState(defaultValues.district);
  const [town, setTown] = useState(defaultValues.town);
  const [phone, setPhone] = useState(defaultValues.phone);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full flex-col justify-between rounded-3xl border border-blue-600 px-8 py-10"
    >
      <div>
        <h2 className="mb-8 text-center text-[28px] font-bold text-blue-600">개인 정보</h2>
        <div className="space-y-4">
          <input
            type="text"
            value={name}
            placeholder="이름"
            onChange={(e) => setName(e.target.value)}
            className="h-10 w-full rounded-lg border px-3"
          />
          <div className="grid grid-cols-3 gap-2">
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="시/도"
              className="h-10 rounded-lg border px-3"
            />
            <input
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              placeholder="구/군"
              className="h-10 rounded-lg border px-3"
            />
            <input
              value={town}
              onChange={(e) => setTown(e.target.value)}
              placeholder="동/면/읍"
              className="h-10 rounded-lg border px-3"
            />
          </div>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="전화번호"
            className="h-10 w-full rounded-lg border px-3"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => onBack({ name, city, district, town, phone })}
          className="h-12 flex-1 rounded-xl border border-blue-600 font-semibold text-blue-600"
        >
          이전
        </button>
        <button
          type="submit"
          className="h-12 flex-1 rounded-xl bg-blue-600 font-semibold text-white hover:bg-blue-700"
        >
          회원가입
        </button>
      </div>
    </form>
  );
};

export default SignupProfileCard;
