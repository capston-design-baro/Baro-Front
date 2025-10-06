import { HttpResponse, delay, http } from 'msw';

// 어떤 origin이든 매칭되도록 '*/api/...' 패턴 사용
export const handlers = [
  // 로그인
  http.post('*/api/auth/login', async ({ request }) => {
    const { email, password } = (await request.json()) as { email?: string; password?: string };

    await delay(400);

    if (!email || !password) {
      return HttpResponse.json({ message: 'EMPTY' }, { status: 400 });
    }
    if (String(email).endsWith('+401@test.com')) {
      return HttpResponse.json({ message: 'INVALID_CREDENTIALS' }, { status: 401 });
    }
    if (String(email).endsWith('+500@test.com')) {
      return HttpResponse.json({ message: 'SERVER_ERROR' }, { status: 500 });
    }

    // 성공 시 access_token 반환
    return HttpResponse.json({ access_token: 'fake-jwt', token_type: 'bearer' }, { status: 200 });
  }),

  // 내 정보
  http.get('*/api/auth/me', async ({ request }) => {
    const auth = request.headers.get('Authorization'); // "Bearer fake-jwt"
    await delay(200);

    if (!auth || !auth.startsWith('Bearer ')) {
      return HttpResponse.json({ message: 'NO_TOKEN' }, { status: 401 });
    }
    const token = auth.slice('Bearer '.length);
    if (token !== 'fake-jwt') {
      return HttpResponse.json({ message: 'TOKEN_INVALID' }, { status: 401 });
    }

    return HttpResponse.json({
      id: 1,
      email: 'admin@example.com',
      name: '관리자(테스트)',
      address: 'Seoul GU DONG',
    });
  }),
];
