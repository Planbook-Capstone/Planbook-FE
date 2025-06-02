import { Steps } from "antd";

const { Step } = Steps;

interface StepItem {
  title: string;
  status?: "wait" | "process" | "finish" | "error";
}

interface AutoGradingStepperProps {
  current: number;
  steps: StepItem[];
}

export default function AutoGradingStepper({
  current,
  steps,
}: AutoGradingStepperProps) {
  return (
    <Steps current={current} size="default" className="mb-8">
      {steps.map((step, idx) => (
        <Step key={idx} title={step.title} status={step.status} />
      ))}
    </Steps>
  );
}
