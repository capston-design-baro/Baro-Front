import axiosInstance from '@/apis/axiosInstance';

// 공용 인스턴스 (Authorization 자동 세팅됨)
const api = axiosInstance;

// API 기본 prefix
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

/** 사전 확인 */
export const registerRelatedCases = (
  complaintId: number,
  payload: {
    duplicate_complaint: boolean;
    related_criminal_case: boolean;
    related_civil_case: boolean;
  },
) => api.post(`${BASE_URL}/complaints/info/related-cases/${complaintId}`, payload);

/** 고소인 정보 등록 -> Complaint 생성 */
export type ComplainantInfoCreate = {
  complainant_name: string;
  complainant_email: string;
  complainant_address: string;
  complainant_phone: string;

  complainant_job: string;
  complainant_office_address: string;
  complainant_office_phone: string;
  complainant_home_phone: string;
};

export type Complaint = {
  id: number;
  user_id: number;
  status: 'in_progress' | 'completed';
  created_at: string;
  ai_session_id?: string | null;
  crime_type?: string | null;
};

export type RagCase = {
  case_no: string;
  label: string;
  summary: string;
  result: string;
  similarity: string;
};

export type ChatInitResponse = {
  session_id: string;
  offense: string | null;
  rag_keyword?: string | null;
  rag_cases?: RagCase[] | null;
};

/** 피고소인 정보 등록 */
export type AccusedInfoCreate = {
  accused_name: string;
  accused_email: string;
  accused_address: string;
  accused_phone: string;

  accused_job: string;
  accused_office_address: string;
  accused_etc?: string;
};

export type EvidenceCreate = {
  has_evidence: boolean;
};

// 메타 페이로드용 타입 분리
export type ChatMetaPayload = {
  offense?: string | null;
  rag_keyword?: string | null;
  rag_cases?: RagCase[] | null;
  [key: string]: string | number | boolean | RagCase[] | null | undefined;
};

export type ChatMessageHistoryItem = {
  id: number;
  complaint_id: number;
  role: 'user' | 'assistant';
  content: string | ChatMetaPayload;
  reason?: string | null;
  created_at: string;
};

/** 고소인 정보 등록 */
export async function createComplaint(data: ComplainantInfoCreate): Promise<Complaint> {
  const res = await api.post(`${BASE_URL}/complaints/info/complainant`, data);
  return res.data as Complaint;
}

/** 피고소인 정보 등록 */
export async function registerAccused(complaintId: number, data: AccusedInfoCreate) {
  const res = await api.post(`${BASE_URL}/complaints/info/accused/${complaintId}`, data);
  return res.data;
}

/** AI 세션 시작 */
export async function initChatSession(complaintId: number, text: string) {
  const res = await api.post(`${BASE_URL}/complaints/${complaintId}/chat/init`, { text });

  const data = res.data as ChatInitResponse;

  return {
    session_id: data.session_id,
    offense: data.offense ?? '',
    rag_keyword: data.rag_keyword ?? null,
    rag_cases: data.rag_cases ?? [],
  };
}

/** 채팅 전송 */
export async function sendChat(complaintId: number, aiSessionId: string, message: string) {
  const res = await api.post(`${BASE_URL}/complaints/${complaintId}/chat/${aiSessionId}`, {
    message,
  });
  return res.data as { reply: string; reason?: string | null };
}

/** 최종 고소장 생성 */
export async function generateFinal(complaintId: number) {
  const res = await api.post(`${BASE_URL}/complaints/${complaintId}/generate`);
  const data = res.data as {
    complaint_id: number;
    criminal_facts: string;
    accusation_reason: string;
    status: 'completed';
  };

  // 위자드에서 쓰기 편하게 가공해서 리턴
  return {
    complaint_id: data.complaint_id,
    status: data.status,
    criminal_facts: data.criminal_facts,
    accusation_reason: data.accusation_reason,
    generated_complaint: `[범죄 사실]\n${data.criminal_facts}\n\n[고소 이유]\n${data.accusation_reason}`,
  };
}

/** DOCX 고소장 다운로드 */
export async function downloadComplaintDocx(complaintId: number) {
  const res = await api.get(`${BASE_URL}/complaints/${complaintId}/download`, {
    responseType: 'blob', // 파일(binary)로 받기
  });

  const blob = new Blob([res.data], {
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  });

  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `고소장_${complaintId}.docx`; // 파일 이름
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}

/** 증거 여부 등록 */
export async function registerEvidence(complaintId: number, payload: EvidenceCreate) {
  const res = await api.post(`${BASE_URL}/complaints/info/evidence/${complaintId}`, payload);
  return res.data;
}

/** 내 고소장 목록 */
export async function getMyComplaints() {
  const res = await api.get(`${BASE_URL}/complaints/`);
  return res.data as Complaint[];
}

/** 채팅 히스토리 */
export async function getChatHistory(complaintId: number): Promise<ChatMessageHistoryItem[]> {
  const res = await api.get(`${BASE_URL}/complaints/${complaintId}/chat/history`);
  const data = res.data as { messages: ChatMessageHistoryItem[] };
  return data.messages ?? [];
}

/** 삭제 */
export async function deleteComplaint(complaintId: number) {
  await api.delete(`${BASE_URL}/complaints/${complaintId}`);
}
