export interface FormStep {
    source: string;
    data: {};
    formId: number;
    action: ActionValue;
    isCompleted: boolean;
}


export enum ActionValue {
    previous,
    next
}