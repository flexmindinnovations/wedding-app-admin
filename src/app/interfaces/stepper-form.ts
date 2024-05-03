import { FormStep } from "./form-step-item";

export interface StepperFormItem {
    id: number;
    key: string;
    title: string;
    route: string;
    isActive: boolean;
    isCompleted: boolean;
    icon: string;
}