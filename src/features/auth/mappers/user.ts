import type { UserResponse } from '@/features/auth/types/auth';
import type { User } from '@/features/auth/types/user';

export function toUser(me: UserResponse): User {
  return {
    id: me.id,
    email: me.email,
    name: me.name,
    address: me.address,
    phone_number: me.phone_number,
  };
}
