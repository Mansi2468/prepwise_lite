export interface StudyPlan {
  id: string;
  subject: string;
  topics: string;
  exam_date: string;
  plan: string;
  created_at: string;
}

export interface GeneratePlanRequest {
  subject: string;
  topics: string;
  examDate: string;
}

export interface GeneratePlanResponse {
  plan: StudyPlan;
}
