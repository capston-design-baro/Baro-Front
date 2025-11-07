import axiosInstance from '@/apis/axiosInstance';

// 공용 인스턴스 (Authorization 자동 세팅됨)

const api = axiosInstance;

// API 기본 prefix
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

/** 고소인 정보 등록 -> Complaint 생성 */
export type ComplainantInfoCreate = {
  complainant_name: string;
  complainant_address: string;
  complainant_phone: string;
};

export type Complaint = {
  id: number;
  user_id: number;
  status: 'in_progress' | 'completed';
  created_at: string;
  ai_session_id?: string | null;
  crime_type?: string | null;
};

export async function createComplaint(data: ComplainantInfoCreate): Promise<Complaint> {
  const res = await api.post(`${BASE_URL}/complaints/info/complainant`, data);
  return res.data as Complaint;
}

/** 피고소인 정보 등록 */
export type AccusedInfoCreate = {
  accused_name: string;
  accused_address: string;
  accused_phone: string;
};

export async function registerAccused(complaintId: number, data: AccusedInfoCreate) {
  const res = await api.post(`${BASE_URL}/complaints/info/accused/${complaintId}`, data);
  return res.data;
}

/** AI 세션 시작 */
export async function startAiSession(complaintId: number, offense: string) {
  const res = await api.post(`${BASE_URL}/complaints/${complaintId}/start`, { offense });
  return res.data as {
    id: number;
    user_id: number;
    status: string;
    crime_type: string;
    created_at: string;
    ai_session_id: string;
    first_question: string;
  };
}

/** 채팅 전송 */
export async function sendChat(complaintId: number, aiSessionId: string, message: string) {
  const res = await api.post(`${BASE_URL}/complaints/${complaintId}/chat/${aiSessionId}`, {
    message,
  });
  return res.data as { reply: string };
}

/** 최종 고소장 생성 */
export async function generateFinal(complaintId: number) {
  const res = await api.post(`${BASE_URL}/complaints/${complaintId}/generate`);
  return res.data as {
    complaint_id: number;
    generated_complaint: string;
    status: 'completed';
  };
}

/** 내 고소장 목록 */
export async function getMyComplaints() {
  const res = await api.get(`${BASE_URL}/complaints`);
  return res.data as Array<{
    id: number;
    status: string;
    crime_type?: string | null;
    created_at: string;
  }>;
}

/** 삭제 */
export async function deleteComplaint(complaintId: number) {
  await api.delete(`${BASE_URL}/complaints/${complaintId}`);
}
