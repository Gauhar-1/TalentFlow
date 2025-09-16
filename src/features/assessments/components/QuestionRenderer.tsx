import type { Question } from "../types";

interface Props {
    question: Question;
    onAnswerChange: (questionId: string, value: any) => void;
    currentResponse: any,
    allResponses: Record<string, any>,
    error? : string
}

export const QuestionRenderer = ({ question, onAnswerChange, currentResponse, allResponses, error }: Props) =>{
    const isVisible = !question.conditions || question.conditions.every(condition =>{
        const dependencyValue = allResponses[condition.questionId];
        if(condition.operator === '==='){
            return dependencyValue === condition.value;
        }
        if(condition.operator === '!=='){
            return dependencyValue !== condition.value;
        }

        return false;
    });

    if(!isVisible){
        return null;
    }

    const renderInput = () =>{
        switch (question.type) {
            case 'short-text': 
            return <input type="text" value={currentResponse || ''} onChange={e => onAnswerChange(question.id, e.target.value)} />
            case 'numeric': 
            return <input type="number" value={currentResponse || ''} onChange={e => onAnswerChange(question.id, e.target.valueAsNumber)} />
            case 'long-text':
                return <textarea value={currentResponse || '' } onChange={e => onAnswerChange(question.id, e.target.value)}></textarea>
            case 'single-choice':
                return (
                    <div>
                        {question.options?.map(opt => (
                            <label key={opt} className="radio-label">
                                <input type="radio" name={question.id} value={opt} checked={currentResponse === opt} onChange={e => onAnswerChange(question.id, e.target.value)} />
                                {opt}
                            </label>
                        ))}
                    </div>
                );
             case 'file-upload':
                return <div><input type="file" /> <small>(File upload stub)</small></div>  
                // Add 'multi-choice' and other types here
             default: 
             return <p>Unsupported question type: {question.type}</p>        
        }
    }

    return (
        <div className="question-wrapper">
            <label>{question.label} {question.validations?.required && '*'}</label>
            {renderInput()}
            {error && <p className="error-message">{error}</p>}
        </div>
    );
}