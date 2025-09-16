import type { Assessment } from "@/features/assessments/types";
import { SAMPLE_ASSESSMENT } from "./AssessmentBuilderPage";
import { useState, type FormEvent } from "react";
import { QuestionRenderer } from "@/features/assessments/components/QuestionRenderer";

const validateResponses = (assessment: Assessment, responses: Record<string, any>) =>{
     const errors: Record<string, string> = {};
     for(const section of assessment.sections) {
        for(const question of section.questions){
            const isVisible = !question.conditions || question.conditions.every(c => responses[c.questionId] === c.value);

            if(isVisible && question.validations?.required && !responses[question.id]){
                errors[question.id] = 'This field is required.';
            }

            // Add other validation logic here (maxLength, range, etc.)
        }
     }
     return errors;
};

export const AssessmentRuntime = ()=> {
    const [assessment] = useState<Assessment>(SAMPLE_ASSESSMENT);
    const [ responses, setResponses ] = useState<Record<string, any>>({});
    const [ errors, setErrors ] = useState<Record<string, string>>({});

    const handleAnswerChange = (questionId: string, value: any) => {
        setResponses(prev => ({
            ...prev,
            [questionId]: value,
        }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const validationErrors = validateResponses(assessment, responses);
        setErrors(validationErrors);

        if(Object.keys(validationErrors).length === 0){
            console.log("Submitting:", responses);
            alert('Form submitted successfully! Check the console.');
        }
        else {
            console.log("Validation Errors:", validationErrors);
            alert('Please fix the errors before submitting.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="runtime-form">
            <h1>{assessment.jobTitle} Assessment</h1>
            {assessment.sections.map(section => (
                <fieldset key={section.id} className="runtime-section">
                    <legend>{section.title}</legend>
                    {section.questions.map(question => (
                        <QuestionRenderer key={question.id} question={question} onAnswerChange={handleAnswerChange} currentResponse={responses[question.id]} allResponses={responses} error={errors[question.id]}/>
                    ))}
                </fieldset>
            ))}
            <button type="submit">Submit Assessment</button>
        </form>
    )
}