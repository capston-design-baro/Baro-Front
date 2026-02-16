export interface CrimeSubcategory {
  id: string;
  name: string;
  description: string;
}

export interface CrimeCategory {
  id: string;
  name: string;
  children: CrimeSubcategory[];
}

export interface CrimeDomain {
  id: 'criminal' | 'civil';
  name: string;
  categories: CrimeCategory[];
}

export const CRIME_TYPES: CrimeDomain[] = [
  {
    id: 'criminal',
    name: '형사',
    categories: [
      {
        id: 'property',
        name: '재산 범죄',
        children: [
          {
            id: 'fraud',
            name: '사기',
            description:
              '타인을 속여 재산상 이익을 얻는 행위입니다. 예: 돈을 빌려가고 갚지 않거나, 허위 사실로 투자금을 받는 경우.',
          },
          {
            id: 'embezzlement',
            name: '횡령',
            description:
              '맡은 돈이나 물건을 본인 소유처럼 사용하는 행위입니다. 회사 자금을 개인적으로 사용하는 경우가 대표적입니다.',
          },
          {
            id: 'theft',
            name: '절도',
            description:
              '타인의 재물을 몰래 가져가는 행위입니다. 예: 지갑, 가방, 물건 등을 훔치는 경우.',
          },
        ],
      },
      {
        id: 'violence',
        name: '폭력 범죄',
        children: [
          {
            id: 'assault',
            name: '폭행',
            description: '상대방의 신체를 때리거나 밀치는 등의 행위로 폭력을 가하는 범죄입니다.',
          },
          {
            id: 'threat',
            name: '협박',
            description: '해를 가할 듯한 말이나 행동으로 상대방을 겁주는 행위입니다.',
          },
          {
            id: 'injury',
            name: '상해',
            description: '폭행보다 더 나아가 상대방에게 실제 신체적 상처나 부상을 입힌 경우입니다.',
          },
        ],
      },
      {
        id: 'reputation',
        name: '명예·모욕 범죄',
        children: [
          {
            id: 'defamation',
            name: '명예훼손',
            description:
              '사실 또는 허위의 내용을 공개적으로 말하거나 게시하여 타인의 사회적 평가를 떨어뜨리는 행위입니다.',
          },
          {
            id: 'insult',
            name: '모욕',
            description: '구체적인 사실 언급 없이 상대방을 비하하거나 욕하는 행위입니다.',
          },
        ],
      },
      {
        id: 'sexual',
        name: '성범죄',
        children: [
          {
            id: 'sexual_assault',
            name: '성폭력',
            description: '강제로 성적 행위를 하거나 성적 수치심을 주는 행위입니다.',
          },
          {
            id: 'molestation',
            name: '강제추행',
            description: '상대방의 의사에 반해 신체를 만지는 등 성적 수치심을 유발하는 행위입니다.',
          },
          {
            id: 'obscene_media',
            name: '통신매체이용음란',
            description:
              '문자, SNS, 메신저 등 통신수단을 이용해 음란한 내용을 전송하는 행위입니다.',
          },
        ],
      },
      {
        id: 'stalking',
        name: '스토킹·기타',
        children: [
          {
            id: 'stalking',
            name: '스토킹',
            description:
              '상대방의 의사에 반해 반복적으로 접근, 연락, 감시 등의 행위를 하는 범죄입니다.',
          },
          {
            id: 'false_accusation',
            name: '무고',
            description: '사실이 아닌 범죄 사실을 꾸며 타인을 고소하거나 신고하는 행위입니다.',
          },
        ],
      },
    ],
  },
  {
    id: 'civil',
    name: '민사',
    categories: [
      {
        id: 'money',
        name: '금전·채무',
        children: [
          {
            id: 'loan_default',
            name: '빌린 돈을 갚지 않음',
            description: '빌려준 돈을 약속 기한까지 갚지 않거나, 연락이 두절된 경우.',
          },
          {
            id: 'contract_breach',
            name: '계약 위반',
            description: '계약서에 정한 의무(납품, 서비스 제공 등)를 이행하지 않은 경우입니다.',
          },
          {
            id: 'unjust_enrichment',
            name: '부당이득',
            description: '법적 근거 없이 타인의 재산이나 이익을 취한 경우.',
          },
        ],
      },
      {
        id: 'damage',
        name: '손해배상',
        children: [
          {
            id: 'car_accident',
            name: '교통사고',
            description: '교통사고로 인한 재산 손실이나 부상을 입은 경우.',
          },
          {
            id: 'defamation_damage',
            name: '명예훼손 손해배상',
            description: '허위 사실 유포로 명예가 훼손된 피해에 대한 손해배상 청구.',
          },
          {
            id: 'assault_damage',
            name: '폭행으로 인한 손해배상',
            description: '폭행으로 신체적, 정신적 피해를 입은 경우의 배상 청구.',
          },
        ],
      },
      {
        id: 'real_estate',
        name: '부동산',
        children: [
          {
            id: 'lease_deposit',
            name: '전세/월세 보증금',
            description: '임대인이 보증금을 돌려주지 않거나, 계약 관련 분쟁이 발생한 경우.',
          },
          {
            id: 'rental_dispute',
            name: '임대차 분쟁',
            description: '임차료, 계약 기간, 시설 하자 등과 관련된 분쟁.',
          },
        ],
      },
      {
        id: 'family',
        name: '가족관계',
        children: [
          {
            id: 'divorce',
            name: '이혼',
            description: '이혼 절차 및 재산 분할 관련 분쟁.',
          },
          {
            id: 'child_support',
            name: '양육비',
            description: '이혼 후 또는 별거 중 자녀 양육비 지급 문제.',
          },
          {
            id: 'inheritance',
            name: '상속',
            description: '사망자의 재산 분할 관련 분쟁.',
          },
        ],
      },
    ],
  },
];
