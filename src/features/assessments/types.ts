export interface Assessment {
    id: string;
    jobTitle: string,
    sections: Section[];
}

export interface Section {
    id: string;
    title: string;
    description?: string;
    questions: Question[];
}

export interface Question {
    id: string;
    label: string;
    type: 'single-choice' | 'multi-choice' | 'short-text' | 'long-text' | 'numeric' | 'file-upload';

    options?: string[];

    validations?: {
        required?: boolean;
        maxLength?: number;
        range?: { min: number; max: number };
    };

    conditions?: Condition[];
}

export interface Condition {
    questionId: string;
    operator: '===' | '!==';
    value: any;
}