export interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  icon?: string;
}

export interface OnboardingProps {
  onComplete: () => void;
}

