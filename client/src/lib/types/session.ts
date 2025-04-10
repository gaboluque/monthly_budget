

export interface Session {
  jwt: string;
  user: {
    id: number;
    email: string;
    created_at: string;
    updated_at: string;
    onboarding_completed_at: string | null;
  }
}