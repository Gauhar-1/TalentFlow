import { Card, CardContent } from "@/components/ui/card";
import { QuestionEditor } from "./QuestionEditor";
import { CreateAssessment } from "@/features/assessments/components/CreateAssessment";
import { useAssessmentBuilder } from "../context/AssessmentContext";
import { Button } from "@/components/ui/button";


export const ConfigurationPanel = () =>{
    const {assessment , selectedQuestion, selectedSectionTitle, addQuestion } = useAssessmentBuilder();
    


    return (
        <div className="flex flex-col gap-4 max-h-[70vh]">
            <div className="px-5 py-3 border-b-3 border-gray-400">
            <h2 className="font-bold text-2xl text-shadow-lg ">{assessment.jobTitle}</h2>
            <h2 className="font-serif text-gray-600 text-sm text-shadow-lg ">Assessment Builder</h2>
            </div>
            <Card className="bg-gray-500 p-3 mx-4 h-full">
                <div className="flex justify-between p-1">
            <p className="font-semibold  text-shadow-lg text-white">Select a Section and then add the Questions</p>
            <CreateAssessment>Add Section</CreateAssessment>
                </div>
                <CardContent className="bg-white h-full rounded-lg p-0">
            {selectedQuestion ? (
                <QuestionEditor key={selectedQuestion.id} question={selectedQuestion} />
            ):(
                <div className="flex h-[20vh] justify-center items-center">
                    { selectedSectionTitle ? <Button className="bg-white text-gray-500 px-30 py-5 font-bold hover:bg-gray-200 border-2 border-gray-500 border-dashed text-shadow-lg" onClick={()=>{
                    addQuestion(selectedSectionTitle || '');
                }}>Add Question</Button> : <p className="border-2 p-2 rounded-lg border-gray-400 shadow-xl">No Question selected</p>}
                    
                </div>
            )}
                </CardContent>
            </Card>
        </div>
    )
}