export type AITool =
  | 'cursor'
  | 'github-copilot'
  | 'claude'
  | 'chatgpt'
  | 'anthropic-api'
  | 'openai-api'
  | 'gemini'
  | 'windsurf';

export type UsageIntent = 'coding' | 'writing' | 'data' | 'research' | 'mixed';

export interface ToolInput {
  tool: AITool;
  plan: string;
  monthlySpend: number;
  seats: number;
}

export interface FormData {
  tools: ToolInput[];
  teamSize: number;
  useCase: UsageIntent;
}

export interface ToolAuditResult {
  tool: AITool;
  currentSpend: number;
  currentPlan: string;
  recommendation: 'downgrade' | 'switch' | 'optimal' | 'credits';
  recommendedPlan?: string;
  recommendedTool?: string;
  monthlySavings: number;
  reason: string;
}

export interface AuditResult {
  id: string;
  formData: FormData;
  toolResults: ToolAuditResult[];
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  aiSummary?: string;
  createdAt: string;
}

export interface LeadInput {
  auditId: string;
  email: string;
  companyName?: string;
  role?: string;
}
