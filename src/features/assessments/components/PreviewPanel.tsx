import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useAssessmentBuilder } from "../context/AssessmentContext";


export const PreviewPanel = () =>{
    const { assessment,  setSelectedQuestionId, selectedQuestionId,selectedSectionTitle, setSelectedSectionTitle} = useAssessmentBuilder();

    const  sections : string[] = useMemo(()=>{
        const sectionTitles = assessment.sections.map(s =>  s.title);

        return sectionTitles;
    },[assessment])
    

    return (
        <div className="flex flex-col gap-3">
            <Card className="bg-gray-500  p-4 h-[90vh]">

                <CardHeader className="text-white text-2xl text-shadow-lg font-bold">Live Preview</CardHeader>

                <Card className="p-2 rounded-lg my-2">
                        <CardContent className="flex gap-2 overflow-auto">
                        {sections.map( s => (
                            <Button key={s} className={`${ s == selectedSectionTitle ? "bg-gray-500 shadow-xl " :"bg-white text-gray-600 border-1 border-gray-500"} font-mono hover:bg-gray-400 `} onClick={() =>{
                                setSelectedSectionTitle(s)
                            }}>{s}</Button>
                        ))}
                        </CardContent>
                    </Card>

                <CardContent className="bg-white rounded-lg  h-full">
                    {assessment.sections.map(section => {

                    if(selectedSectionTitle == section.title)
                   return <div key={section.id} className="preview-section">
                    <Card className="border-none shadow-none relative">
                            <h4 className="absolute top-3 bg-white px-2 left-5 text-lg">{section.title}</h4>
                        <CardContent className="border-2 rounded-lg border-gray-500 px-4 h-[65vh]  pt-6 pb-2 overflow-y-auto">
                    {section.questions.map(q => (
                        <div key={q.id} className={`preview-question ${q.id === selectedQuestionId ? 'selected' : ''}`} onClick={()=> setSelectedQuestionId(q.id)}>
                            <label>{q.label}{q.validations?.required && '*'}</label>
                            {q.type === 'short-text' && <input type="text" placeholder="Answer..." className="border-2 p-2 w-full rounded" />}
                            {q.type === 'numeric' && <input type="text" placeholder="0" readOnly/>}
                            {q.type === 'long-text' && <textarea placeholder="Long answer..." className="border-2 p-2 w-full rounded"/>}
                            {q.type === 'single-choice' && q.options?.map(opt => (
                                <div key={opt} className="flex gap-2">
                                    <input type="radio" name={q.id} readOnly />
                                    {opt}
                                </div>
                            ))}
                            {q.type === 'multi-choice' && q.options?.map(opt => (
            <div key={opt} className="flex gap-2 items-center">
                <input type="checkbox" name={q.id} readOnly />
                <span>{opt}</span>
            </div>
        ))}
        
        {/* --- Added File Upload --- */}
        {q.type === 'file-upload' && (
            <div className="mt-2">
                <input 
                    type="file" 
                    disabled 
                    className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4  file:rounded-full file:border-2 file:border-gray-400 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
            </div>
        )}
                        </div>
                    ))}
                        </CardContent>
                    </Card>
                    
                </div>
            })}
                </CardContent>
            </Card>
            
        </div>
    )
}