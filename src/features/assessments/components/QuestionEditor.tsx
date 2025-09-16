import { useState, type ChangeEvent } from "react";
import type { Question } from "../types";
import { useAssessmentBuilder } from "../context/AssessmentContext";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface Props {
    question: Question;
}

export const QuestionEditor = ({ question }: Props) =>{

    const { handleUpdateQuestion, handleSave , selectedSectionTitle, addQuestion, selectedQuestionId, handleDelete } = useAssessmentBuilder();
    const [newOption, setNewOption] = useState('')

    const handleLabelChange = (e : ChangeEvent<HTMLInputElement>) => {
        handleUpdateQuestion({ ...question, label: e.target.value });
    }

     const handleTypeChange = (value: Question['type']) => {
        // When changing type, initialize options array if it's a choice type
        const newProps = (value === 'single-choice' || value === 'multi-choice') 
            ? { options: question.options || [] } 
            : { options: undefined };
            
        handleUpdateQuestion({ ...question, type: value, ...newProps });
    }

    const handleOptionChange = (index: number, value: string) => {
        const updatedOptions = [...(question.options || [])];
        updatedOptions[index] = value;
        handleUpdateQuestion({ ...question, options: updatedOptions });
    }
    
    const handleAddOption = () => {
        if (newOption.trim() === '') return;
        const updatedOptions = [...(question.options || []), newOption];
        handleUpdateQuestion({ ...question, options: updatedOptions });
        setNewOption(''); // Clear the input
    }
    
    const handleDeleteOption = (index: number) => {
        const updatedOptions = (question.options || []).filter((_, i) => i !== index);
        handleUpdateQuestion({ ...question, options: updatedOptions });
    }

    return (
        <div className="h-full">
            <div className="flex justify-between border-b-5 border-gray-400 p-2">
                <div className="flex items-center gap-4">
             <div className="flex gap-2">
            <h3 className="font-serif">Editing Question :</h3>
            <h3 className="font-semibold">{(question.id).split('-')[1]}</h3>
                </div>
                <div className="flex gap-2">
            <h3 className="font-serif">Section :</h3>
            <h3 className="font-semibold">{selectedSectionTitle}</h3>
                </div>
                </div>
            </div>
            
            <Card className="p-0">
            <CardContent className="p-2 overflow-y-auto max-h-[50vh] bg-gray-300 rounded-lg m-2 flex flex-col gap-4">
            <label className=" p-2 flex flex-col gap-2">
                <label className="font-semibold">Question Label</label>
                <input type="text" className="bg-white p-2 rounded-lg font-light" value={question.label} onChange={handleLabelChange} />
            </label>

             {/* --- Question Type Selector --- */}
                <div className="flex flex-col gap-1">
                    <label className="font-semibold">Question Type</label>
                    <Select value={question.type} onValueChange={handleTypeChange}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="short-text">Short Text</SelectItem>
                            <SelectItem value="long-text">Long Text</SelectItem>
                            <SelectItem value="single-choice">Single Choice</SelectItem>
                            <SelectItem value="multi-choice">Multi-Choice</SelectItem>
                            <SelectItem value="numeric">Numeric</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* --- Conditional Options Editor --- */}
                {(question.type === 'single-choice' || question.type === 'multi-choice') && (
                    <div className="border-t pt-4 mt-2 space-y-3">
                        <label className="font-semibold">Options</label>
                        {(question.options || []).map((option, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <Input 
                                    value={option} 
                                    onChange={(e) => handleOptionChange(index, e.target.value)}
                                    className="flex-grow"
                                />
                                <Button variant="ghost" size="icon" onClick={() => handleDeleteOption(index)} className="text-red-500">
                                    &times;
                                </Button>
                            </div>
                        ))}
                        <div className="flex items-center gap-2 pt-2">
                            <Input 
                                placeholder="Add new option" 
                                value={newOption}
                                onChange={(e) => setNewOption(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddOption()}
                            />
                            <Button onClick={handleAddOption}>Add</Button>
                        </div>
                    </div>
                )}

            <div className="p-2 flex gap-2">
                <input type="checkbox" checked={!!question.validations?.required} onChange={e => handleUpdateQuestion({
                    ...question,
                    validations: { ...question.validations, required: e.target.checked }
                })}/>
                <h2 className="font-mono">Required</h2>
            </div>
            <div className="flex justify-end">
            <Button onClick={()=>{
                handleDelete(selectedQuestionId || '' , selectedSectionTitle || "")
            }} className="bg-blue-600 hover:bg-blue-700 my-3 mx-2">Delete</Button>
            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 my-3 mx-2">Save Assessment</Button>
            </div>
            </CardContent>
            {selectedSectionTitle && <CardFooter className="m-2 flex justify-center">
                <Button className="bg-white text-gray-500 px-30 py-5 font-bold hover:bg-gray-200 border-2 border-gray-500 border-dashed text-shadow-lg" onClick={()=>{
                    addQuestion(selectedSectionTitle || '');
                }}>Add Question</Button>
            </CardFooter>}
            </Card>

            {/* Add inputs for other properties: type, options, etc. here */}
        </div>
    )
}