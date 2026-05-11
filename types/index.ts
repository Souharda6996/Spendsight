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

export interface OverlapResult {
  /** The two tools that overlap */
  toolA: AITool;
  toolB: AITool;
  /** Human-readable label for each */
  toolALabel: string;
  toolBLabel: string;
  /** Shared capability they duplicate */
  capability: string;
  /** Short actionable recommendation */
  recommendation: string;
  /** Which tool to keep and why */
  keepTool: AITool;
  keepToolLabel: string;
  /** Combined monthly spend of the overlapping pair */
  combinedSpend: number;
  /** Severity: 'high' = paying double for same thing, 'medium' = partial overlap */
  severity: 'high' | 'medium';
}

export interface AuditResult {
  id: string;
  formData: FormData;
  toolResults: ToolAuditResult[];
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  aiSummary?: string;
  overlapResults?: OverlapResult[];
  createdAt: string;
}

export interface LeadInput {
  auditId: string;
  email: string;
  companyName?: string;
  role?: string;
}

