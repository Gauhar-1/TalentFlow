// This is a helper component to render different question types.

import { ErrorPage } from "@/components/shared/ErrorPage";
import { LoadingScreeen } from "@/components/shared/LoadinScreen";
import { SubmissionSuccessPage } from "@/components/shared/SubmissionSuccessPage";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useGetAssessment } from "@/features/assessments/hooks/useAssessment";
import { useSubmitAssessment } from "@/features/assessments/hooks/useMutation";
import type { Assessment, Question, Section } from "@/features/assessments/types";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useParams } from "react-router-dom";


const validateResponses = (assessment: Assessment, responses: Record<string, any>) => {
    const errors: Record<string, string> = {};
    const allQuestions = assessment.sections.flatMap(s => s.questions);

    for (const question of allQuestions) {
        const response = responses[question.id];
        const isVisible = !question.conditions || question.conditions.every(c => responses[c.questionId] === c.value);

        if (!isVisible) continue;

      if (question.validations?.required) {
            let isMissing = false;
            if (question.type === 'multi-choice') {
                isMissing = !Array.isArray(response) || response.length === 0;
            } else {
                isMissing = response === undefined || response === null || response === '';
            }

            if (isMissing) {
                errors[question.id] = 'This field is required.';
                continue;
            }
        }

        if (response === undefined || response === null || response === '') continue;

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

export const QuestionRenderer = ({ question, onAnswerChange, currentResponse, error }: {
    question: Question;
    onAnswerChange: (questionId: string, value: any) => void;
    currentResponse: any;
    error?: string;
}) => {
    const renderInput = () => {
        switch (question.type) {
             case 'long-text':
                return <Textarea value={currentResponse || ''} onChange={(e) => onAnswerChange(question.id, e.target.value)} className="bg-gray-100" />;

            case 'short-text':
                return <Input type="text" value={currentResponse || ''} onChange={(e) => onAnswerChange(question.id, e.target.value)} className="bg-gray-100" />;
            case 'numeric':
                return <Input type="number" value={currentResponse || ''} onChange={(e) => onAnswerChange(question.id, e.target.value)} />;
            case 'single-choice':
                return (
                    <RadioGroup value={currentResponse} onValueChange={(value) => onAnswerChange(question.id, value)}>
                        {question.options?.map((option) => (
                            <div key={option} className="flex items-center space-x-2">
                                <RadioGroupItem value={option} id={`${question.id}-${option}`} className="bg-white"/>
                                <Label htmlFor={`${question.id}-${option}`}>{option}</Label>
                            </div>
                        ))}
                    </RadioGroup>
                    
                );
            case 'multi-choice': {
                const selection = Array.isArray(currentResponse) ? currentResponse : [];
                return (
                    <div className="space-y-2">
                        {question.options?.map((option) => (
                            <div key={option} className="flex items-center space-x-2">
                                <Checkbox
                                    id={`${question.id}-${option}`}
                                    checked={selection.includes(option)}
                                    onCheckedChange={(checked) => {
                                        const newSelection = checked
                                            ? [...selection, option]
                                            : selection.filter((item) => item !== option);
                                        onAnswerChange(question.id, newSelection);
                                    }}
                                className="bg-gray-100"/>
                                <Label htmlFor={`${question.id}-${option}`}>{option}</Label>
                            </div>
                        ))}
                    </div>
                );
            }

            case 'file-upload':
                return (
                    <div>
                        <Input
                            type="file"
                            onChange={(e) => onAnswerChange(question.id, e.target.files ? e.target.files[0] : null)} className="bg-gray-100"
                        />
                        {currentResponse && (
                            <p className="text-sm text-gray-600 mt-2">
                                Selected file: <strong>{currentResponse.name}</strong>
                            </p>
                        )}
                    </div>
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
    const [responses, setResponses] = useState<Record<string, any>>({});
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [api, setApi] = useState<CarouselApi>();
    const [currentSlide, setCurrentSlide] = useState(0);
    const { id } = useParams();
    const jobId = id || '';
    const { data : assessment, isLoading, isError, error: fetchError } = useGetAssessment(jobId || '');

    const { mutate, isPending, isSuccess } = useSubmitAssessment();

    const allQuestions = useMemo(() => {
        return assessment?.sections.flatMap((section : Section) => section.questions) || [];
    }, [assessment]);
    
    const visibleQuestions = allQuestions.filter((question : Question) => {
        if (!question.conditions) return true; 

        return question.conditions.every(cond => responses[cond.questionId] === cond.value);
    });

    const currentSectionTitle = useMemo(() => {
        if (!visibleQuestions[currentSlide]) return "";
        const currentQuestionId = visibleQuestions[currentSlide].id;
        return assessment?.sections.find((s : Section) => s.questions.some(q => q.id === currentQuestionId))?.title || "";
    }, [assessment, visibleQuestions, currentSlide]);

    useEffect(() => {
        if (!api) return;
        
        setCurrentSlide(api.selectedScrollSnap());
        
        api.on("select", () => {
            setCurrentSlide(api.selectedScrollSnap());
            setErrors({}); 
        });
    }, [api]);

    const canGoNext = useMemo(() => {
        const currentQuestion = visibleQuestions[currentSlide];
        if (!currentQuestion) return false;
        if (!currentQuestion.validations?.required) return true;

        const response = responses[currentQuestion.id];
        return response !== undefined && response !== null && response !== '';
    }, [visibleQuestions, currentSlide, responses]);

    const handleAnswerChange = (questionId: string, value: any) => {
        setResponses(prev => ({
            ...prev,
            [questionId]: value,
        }));
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
            mutate({ jobId, candidateId: '1', answers: responses });
        } else {
            console.log("Validation Errors:", validationErrors);
            alert('Please fix the errors on all questions before submitting.');
        }
    };

    if (isSuccess) {
        return <SubmissionSuccessPage />;
    }


    if(isLoading || isPending) return <LoadingScreeen />
    if(isError) return <ErrorPage>Error found: {fetchError.message}</ErrorPage>

    return (
        <Card className="bg-gray-500 p-5 mx-20 mt-8">
            <CardHeader><div>
            <h1 className="text-2xl text-white text-shadow-lg font-bold">{assessment.jobTitle} </h1>
            <p className="text-gray-300 text-shadow-lg">Assessment</p>
            </div></CardHeader>
            <CardContent className="bg-white rounded-lg py-8">
        <form id={"assessment-form"} onSubmit={handleSubmit} className="p-14 bg-gray-200 max-w-lg border-4 border-gray-500 rounded-lg mx-auto space-y-6">
            
            <div className="text-center p-2 bg-gray-100 rounded-md">
                <h2 className="text-lg font-semibold text-gray-700">{currentSectionTitle}</h2>
                <p className="text-sm text-gray-500">Question {currentSlide + 1} of {visibleQuestions.length}</p>
            </div>

            <Carousel className="w-full" setApi={setApi}>
                <CarouselContent className="">
                    {visibleQuestions.map((question :Question ) => (
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
                 <div className="flex justify-between items-center mt-4">
                    <CarouselPrevious />
                        <CarouselNext disabled={!canGoNext} />
                </div>
            </Carousel>

           
        </form>
            </CardContent>
            <CardFooter className="flex justify-end">
                  <button   form="assessment-form" 
        type="submit" className="px-4 py-2 my-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Submit Assessment
            </button>
            </CardFooter>
        </Card>
    );
};