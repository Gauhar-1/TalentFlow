// src/contexts/AssessmentBuilderContext.tsx

import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import type { Assessment, Question, Section } from '@/features/assessments/types';
import { useGetAssessment } from '../hooks/useAssessment';
import { useParams } from 'react-router-dom';
import { useUpdateAssessment } from '../hooks/useMutation';

const BLANK_ASSESSMENT: Assessment = {
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
      ]
    },
    {
       "id": "sec-2",
       "title": "Technical",
      "questions": [
        {
           "id": "q-1",
           "label": "Full Name",
           "type": "short-text",
          "validations": { "required": true, "maxLength": 100 }
         },
      ]
    },
   ]
};

interface AssessmentBuilderContextType {
  assessment: Assessment;
  setAssessment : (a :Assessment) => void;
  selectedQuestionId: string | null;
  setSelectedQuestionId: (id: string | null) => void;
  handleUpdateQuestion: (updatedQuestion: Question) => void;
  addSection: () => void;
  addQuestion: (sectionId: string) => void;
  handleSave : ()=> void;
  selectedQuestion : Question | undefined;
  selectedSectionTitle : string | null;
  setSelectedSectionTitle : (title : string) => void;
  handleDelete : (qid : string, sid: string) => void;
  isSaving : boolean,
  isLoading : boolean,
  isError : boolean
  
}

const AssessmentBuilderContext = createContext<AssessmentBuilderContextType | undefined>(undefined);

// Create the Provider component
export const AssessmentBuilderProvider = ({ children }: { children: React.ReactNode }) => {
  const { jobId } =useParams();
  const [assessment, setAssessment] = useState<Assessment>(BLANK_ASSESSMENT);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
  const [selectedSectionTitle, setSelectedSectionTitle] = useState<string | null>(null);
  const { data, isLoading, isError } = useGetAssessment(jobId || '');
    const { mutate, isPending: isSaving } = useUpdateAssessment();

   useEffect(() => {
     if (data) {
           console.log("Data loaded in Context:", data);
           setAssessment(data.assessment);
        }
   }, [data]);

  const addSection = useCallback(() => {
    const newSection: Section = {
      id: `sec-${Date.now()}`,
      title: `Section ${assessment?.sections.length + 1}`,
      questions: [],
    };
    setAssessment(prev => ({ ...prev, sections: [...prev.sections, newSection] }));
  }, [assessment?.sections]);

  const handleUpdateQuestion = (updatedQuestion: Question)=>{
        const newAssessment = {...assessment };
        const sectionIndex = newAssessment.sections.findIndex(s => s.questions.some(q => q.id === updatedQuestion.id));

        if(sectionIndex > -1){
            const questionIndex = newAssessment.sections[sectionIndex].questions.findIndex(q => q.id === updatedQuestion.id);

            if(questionIndex > -1){
                newAssessment.sections[sectionIndex].questions[questionIndex] = updatedQuestion;
                setAssessment(newAssessment);
            }
        }
    }

    const handleSave = () =>{
      if (!jobId) {
        console.error("Cannot save: No Job ID found in URL.");
        alert("Cannot save: No Job ID found.");
        return;
      }
      console.log("Saving Assessment:", assessment);
      
      mutate({ jobId, assessment });
    };

  const addQuestion = useCallback((sectionId: string) => {
    const newQuestion: Question = {
      id: `q-${Date.now()}`,
      label: 'New Question',
      type: 'short-text',
    };
    setAssessment((prev )=> {
      const newSections = prev.sections.map((s) => {
        if (s.title === sectionId) {
          return { ...s, questions: [...s.questions, newQuestion] };
        }
        return s;
      });
      return { ...prev, sections: newSections };
    });
    setSelectedQuestionId(newQuestion.id);
  }, []);

  const handleDelete = (Qid : string, sectionId : string) =>{
    setAssessment((prev) => {
      const newSections = prev.sections.map(s => {
        if(s.title === sectionId){
          const updatedQuestions = s.questions.filter( q => q.id !== Qid);

          return { ...s, questions : updatedQuestions };
        }
        return s;
      });
     return { ...prev, sections: newSections };
    })
  }

 

   const selectedQuestion = assessment?.sections?.flatMap(s => s.questions).find(q => q.id === selectedQuestionId);

  const value = {
    assessment,
    setAssessment,
    selectedQuestionId,
    setSelectedQuestionId,
    addSection,
    addQuestion,
    handleSave,
    selectedQuestion,
    handleUpdateQuestion,
    selectedSectionTitle,
    setSelectedSectionTitle,
    handleDelete,
    isLoading: isLoading && !!jobId,
    isSaving,
    isError
  };

  return (
    <AssessmentBuilderContext.Provider value={value}>
      {children}
    </AssessmentBuilderContext.Provider>
  );
};

// Create a custom hook for easy consumption of the context
export const useAssessmentBuilder = () => {
  const context = useContext(AssessmentBuilderContext);
  if (context === undefined) {
    throw new Error('useAssessmentBuilder must be used within an AssessmentBuilderProvider');
  }
  return context;
};