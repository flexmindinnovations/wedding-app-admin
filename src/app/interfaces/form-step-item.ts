export interface FormStep {
    source: string;
    data: {} | any;
    formId: number;
    active: boolean;
    action?: ActionValue;
    completeKey?: string;
    isCompleted: boolean;
    previous?: FormStep | null;
    steps?: any;
    next?: FormStep | null;
}


export enum ActionValue {
    previous,
    next
}