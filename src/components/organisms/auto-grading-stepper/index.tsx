import { Steps } from "antd";
import { on } from "events";
import { ReactElement } from "react";

const { Step } = Steps;

interface StepItem {
  title: ReactElement;
  status?: "wait" | "process" | "finish" | "error";
}

interface AutoGradingStepperProps {
  current: number;
  steps: StepItem[];
  onChange: (value: number) => void;
}

export default function AutoGradingStepper({
  current,
  steps,
  onChange,
}: AutoGradingStepperProps) {
  return (
    <Steps
      progressDot
      current={current}
      size="default"
      className="mb-8 !font-questrial"
      onChange={onChange}
    >
      {steps.map((step, idx) => (
        <Step key={idx} title={step.title} status={step.status} />
      ))}
    </Steps>
  );
}
