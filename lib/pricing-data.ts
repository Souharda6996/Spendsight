import { AITool, UsageIntent } from '@/types';

export interface PlanPricing {
  planId: string;
  planLabel: string;
  pricePerSeatPerMonth: number | null; // null = enterprise/custom
  minSeats?: number;
  notes?: string;
}

export interface ToolPricing {
  tool: AITool;
  label: string;
  plans: PlanPricing[];
  primaryUseCase: UsageIntent[];
}

export const PRICING_DATA: Record<AITool, ToolPricing> = {
  cursor: {
    tool: 'cursor',
    label: 'Cursor',
    primaryUseCase: ['coding'],
    plans: [
      {
        planId: 'cursor-hobby',
        planLabel: 'Hobby',
        pricePerSeatPerMonth: 0,
        notes: 'Limited completions, 2000 completions/mo',
      },
      {
        planId: 'cursor-pro',
        planLabel: 'Pro',
        pricePerSeatPerMonth: 20,
        notes: 'Unlimited completions, priority access',
      },
      {
        planId: 'cursor-business',
        planLabel: 'Business',
        pricePerSeatPerMonth: 40,
        notes: 'Team features, SSO, centralized billing',
      },
      {
        planId: 'cursor-enterprise',
        planLabel: 'Enterprise',
        pricePerSeatPerMonth: null,
        notes: 'Custom pricing, dedicated support',
      },
    ],
  },
  'github-copilot': {
    tool: 'github-copilot',
    label: 'GitHub Copilot',
    primaryUseCase: ['coding'],
    plans: [
      {
        planId: 'copilot-individual',
        planLabel: 'Individual',
        pricePerSeatPerMonth: 10,
        notes: '$100/year if billed annually',
      },
      {
        planId: 'copilot-business',
        planLabel: 'Business',
        pricePerSeatPerMonth: 19,
        notes: 'Organization management, policy controls',
      },
      {
        planId: 'copilot-enterprise',
        planLabel: 'Enterprise',
        pricePerSeatPerMonth: 39,
        notes: 'GitHub Enterprise required, Copilot Chat in IDE & GitHub.com',
      },
    ],
  },
  claude: {
    tool: 'claude',
    label: 'Claude (Anthropic)',
    primaryUseCase: ['writing', 'research', 'coding', 'mixed'],
    plans: [
      {
        planId: 'claude-free',
        planLabel: 'Free',
        pricePerSeatPerMonth: 0,
        notes: 'Limited usage, Claude Haiku access only',
      },
      {
        planId: 'claude-pro',
        planLabel: 'Pro',
        pricePerSeatPerMonth: 20,
        notes: '5x usage vs Free, Claude Sonnet & Opus access',
      },
      {
        planId: 'claude-max-5x',
        planLabel: 'Max (5x)',
        pricePerSeatPerMonth: 100,
        notes: '5x usage vs Pro, highest priority access',
      },
      {
        planId: 'claude-max-20x',
        planLabel: 'Max (20x)',
        pricePerSeatPerMonth: 200,
        notes: '20x usage vs Pro, highest priority access',
      },
      {
        planId: 'claude-team',
        planLabel: 'Team',
        pricePerSeatPerMonth: 30,
        minSeats: 5,
        notes: 'Minimum 5 seats, team collaboration features, admin controls',
      },
      {
        planId: 'claude-enterprise',
        planLabel: 'Enterprise',
        pricePerSeatPerMonth: null,
        notes: 'Custom pricing, SSO, expanded context window',
      },
    ],
  },
  chatgpt: {
    tool: 'chatgpt',
    label: 'ChatGPT (OpenAI)',
    primaryUseCase: ['writing', 'research', 'mixed'],
    plans: [
      {
        planId: 'chatgpt-free',
        planLabel: 'Free',
        pricePerSeatPerMonth: 0,
        notes: 'GPT-4o mini, limited GPT-4o',
      },
      {
        planId: 'chatgpt-plus',
        planLabel: 'Plus',
        pricePerSeatPerMonth: 20,
        notes: 'GPT-4o, advanced tools, 80+ GPTs',
      },
      {
        planId: 'chatgpt-team',
        planLabel: 'Team',
        pricePerSeatPerMonth: 30,
        minSeats: 2,
        notes: 'Minimum 2 seats, workspace, admin console ($25/seat billed annually)',
      },
      {
        planId: 'chatgpt-enterprise',
        planLabel: 'Enterprise',
        pricePerSeatPerMonth: null,
        notes: 'Custom pricing, SOC 2 compliance, unlimited usage',
      },
    ],
  },
  'anthropic-api': {
    tool: 'anthropic-api',
    label: 'Anthropic API',
    primaryUseCase: ['coding', 'data', 'mixed'],
    plans: [
      {
        planId: 'anthropic-api-payg',
        planLabel: 'Pay-as-you-go',
        pricePerSeatPerMonth: null,
        notes: 'Token-based pricing, no fixed seat cost. Claude 3.5 Sonnet: $3/MTok input, $15/MTok output',
      },
    ],
  },
  'openai-api': {
    tool: 'openai-api',
    label: 'OpenAI API',
    primaryUseCase: ['coding', 'data', 'mixed'],
    plans: [
      {
        planId: 'openai-api-payg',
        planLabel: 'Pay-as-you-go',
        pricePerSeatPerMonth: null,
        notes: 'Token-based pricing. GPT-4o: $2.50/MTok input, $10/MTok output',
      },
    ],
  },
  gemini: {
    tool: 'gemini',
    label: 'Google Gemini',
    primaryUseCase: ['writing', 'research', 'mixed'],
    plans: [
      {
        planId: 'gemini-free',
        planLabel: 'Free',
        pricePerSeatPerMonth: 0,
        notes: 'Gemini 1.5 Pro with limits',
      },
      {
        planId: 'gemini-ai-premium',
        planLabel: 'Google One AI Premium',
        pricePerSeatPerMonth: 19.99,
        notes: 'Gemini Advanced (Ultra 1.0), 2TB storage, Google Workspace integration',
      },
      {
        planId: 'gemini-business',
        planLabel: 'Gemini for Google Workspace Business',
        pricePerSeatPerMonth: null,
        notes: 'Custom pricing per org',
      },
      {
        planId: 'gemini-enterprise',
        planLabel: 'Enterprise',
        pricePerSeatPerMonth: null,
        notes: 'Custom pricing, enterprise security',
      },
    ],
  },
  windsurf: {
    tool: 'windsurf',
    label: 'Windsurf (Codeium)',
    primaryUseCase: ['coding'],
    plans: [
      {
        planId: 'windsurf-free',
        planLabel: 'Free',
        pricePerSeatPerMonth: 0,
        notes: 'Basic completions, limited Flows',
      },
      {
        planId: 'windsurf-pro',
        planLabel: 'Pro',
        pricePerSeatPerMonth: 15,
        notes: 'Unlimited completions, 500 Flows credits/mo',
      },
      {
        planId: 'windsurf-team',
        planLabel: 'Teams',
        pricePerSeatPerMonth: 35,
        notes: 'Team collaboration, admin controls, priority support',
      },
    ],
  },
};

export function getPlanById(tool: AITool, planId: string): PlanPricing | undefined {
  return PRICING_DATA[tool]?.plans.find((p) => p.planId === planId);
}

export function getCheapestPlan(tool: AITool): PlanPricing | undefined {
  const plans = PRICING_DATA[tool]?.plans.filter(
    (p) => p.pricePerSeatPerMonth !== null
  );
  if (!plans || plans.length === 0) return undefined;
  return plans.reduce((min, p) =>
    (p.pricePerSeatPerMonth ?? Infinity) < (min.pricePerSeatPerMonth ?? Infinity) ? p : min
  );
}
