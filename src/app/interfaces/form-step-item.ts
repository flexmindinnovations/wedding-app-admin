export interface FormStep {
    source: string;
    data: {} | any;
    formId: number;
    action: ActionValue;
    isCompleted: boolean;
}


export enum ActionValue {
    previous,
    next
}