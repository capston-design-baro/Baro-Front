import type { UserResponseDto } from '@/features/auth/types/dto';
import type { User } from '@/features/auth/types/model';

// DTO -> Model 변환 함수
export function toUser(dto: UserResponseDto): User {
  return {
    id: dto.id,
    email: dto.email,
    name: dto.name,
    address: dto.address,
    phoneNumber: dto.phone_number,
    createdAt: new Date(dto.created_at),
  };
}
