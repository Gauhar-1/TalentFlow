// This is a helper component to render different question types.

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { Assessment, Question } from "@/features/assessments/types";
import { useMemo, useState, type FormEvent } from "react";

export const SAMPLE_ASSESSMENT: Assessment = {

  "id": "job-123-assessment",

  "jobTitle": "Senior Frontend Developer",

  "sections": [

    {

      "id": "sec-1",

      "title": "Basic Information",

      "questions": [

        {

          "id": "q-1",

          "label": "Full Name",

          "type": "short-text",

          "validations": { "required": true, "maxLength": 100 }

        },

        {

          "id": "q-2",

          "label": "Are you legally authorized to work?",

          "type": "single-choice",

          "options": ["Yes", "No"],

          "validations": { "required": true }

        }

      ]

    },

 {

 "id": "sec-2",

 "title": "Technical Skills",

 "questions": [

 {

"id": "q-4",

          "label": "Years of professional experience?",

          "type": "numeric",

          "validations": { "required": true, "range": { "min": 0, "max": 50 } }

        }

      ]

    }

  ]

};

const validateResponses = (assessment: Assessment, responses: Record<string, any>) => {
    const errors: Record<string, string> = {};
    const allQuestions = assessment.sections.flatMap(s => s.questions);

    for (const question of allQuestions) {
        const response = responses[question.id];
        // Determine if the question should be visible based on responses to other questions
        const isVisible = !question.conditions || question.conditions.every(c => responses[c.questionId] === c.value);

        // Only validate visible questions
        if (!isVisible) continue;

        // Required validation
        if (question.validations?.required && (response === undefined || response === null || response === '')) {
            errors[question.id] = 'This field is required.';
            continue; // Stop further validation if required field is empty
        }

        // Return early if there's no response for a non-required field
        if (response === undefined || response === null || response === '') continue;

        // MaxLength validation
        if (question.validations?.maxLength && String(response).length > question.validations.maxLength) {
            errors[question.id] = `Must be ${question.validations.maxLength} characters or less.`;
        }

        // Numeric Range validation
        if (question.validations?.range) {
            const numericValue = parseFloat(response);
            const { min, max } = question.validations.range;
            if (isNaN(numericValue) || numericValue < min || numericValue > max) {
                errors[question.id] = `Value must be between ${min} and ${max}.`;
            }
        }
    }
    return errors;
};

// In a real app, this would likely be in its own file.
export const QuestionRenderer = ({ question, onAnswerChange, currentResponse, error }: {
    question: Question;
    onAnswerChange: (questionId: string, value: any) => void;
    currentResponse: any;
    error?: string;
}) => {
    const renderInput = () => {
        switch (question.type) {
            case 'short-text':
                return <Input type="text" value={currentResponse || ''} onChange={(e) => onAnswerChange(question.id, e.target.value)} />;
            case 'numeric':
                return <Input type="number" value={currentResponse || ''} onChange={(e) => onAnswerChange(question.id, e.target.value)} />;
            case 'single-choice':
                return (
                    <RadioGroup value={currentResponse} onValueChange={(value) => onAnswerChange(question.id, value)}>
                        {question.options?.map((option) => (
                            <div key={option} className="flex items-center space-x-2">
                                <RadioGroupItem value={option} id={`${question.id}-${option}`} />
                                <Label htmlFor={`${question.id}-${option}`}>{option}</Label>
                            </div>
                        ))}
                    </RadioGroup>
                );
            default:
                return <p>Unsupported question type: {question.type}</p>;
        }
    };

    return (
        <div className="p-4 space-y-2">
            <Label htmlFor={question.id}>{question.label}</Label>
            {renderInput()}
            {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
        </div>
    );
};


export const AssessmentRuntime = () => {
    const [assessment] = useState<Assessment | null>(SAMPLE_ASSESSMENT);
    const [responses, setResponses] = useState<Record<string, any>>({});
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Memoize the flattened list of all questions
    const allQuestions = useMemo(() => {
        return assessment?.sections.flatMap(section => section.questions) || [];
    }, [assessment]);
    
    // Filter questions to only include those that should be visible
    const visibleQuestions = allQuestions.filter(question => {
        if (!question.conditions) return true; // Always visible if no conditions
        return question.conditions.every(cond => responses[cond.questionId] === cond.value);
    });

    const handleAnswerChange = (questionId: string, value: any) => {
        setResponses(prev => ({
            ...prev,
            [questionId]: value,
        }));
        // Optional: clear error on change
        if (errors[questionId]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[questionId];
                return newErrors;
            });
        }
    };

    const handleSubmit = (e: FormEvent) => {
        if (!assessment) return;
        e.preventDefault();
        const validationErrors = validateResponses(assessment, responses);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            console.log("Submitting:", responses);
            alert('Form submitted successfully! Check the console.');
        } else {
            console.log("Validation Errors:", validationErrors);
            alert('Please fix the errors before submitting.');
        }
    };

    if (!assessment) {
        return <div>Loading assessment...</div>;
    }

    return (
        <form onSubmit={handleSubmit} className="p-8 max-w-lg mx-auto space-y-6">
            <h1 className="text-2xl font-bold">{assessment.jobTitle} Assessment</h1>

            <Carousel className="w-full">
                <CarouselContent>
                    {visibleQuestions.map(question => (
                        <CarouselItem key={question.id}>
                            <QuestionRenderer
                                question={question}
                                onAnswerChange={handleAnswerChange}
                                currentResponse={responses[question.id]}
                                error={errors[question.id]}
                            />
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>

            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Submit Assessment
            </button>
        </form>
    );
};