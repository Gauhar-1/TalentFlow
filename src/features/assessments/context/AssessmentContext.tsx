// src/contexts/AssessmentBuilderContext.tsx

import React, { createContext, useState, useContext, useCallback } from 'react';
import type { Assessment, Question, Section } from '@/features/assessments/types';
import { SAMPLE_ASSESSMENT } from '@/pages/AssessmentBuilderPage';

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
  handleDelete : (qid : string, sid: string) => void
  // You can add delete functions here as well
}

const AssessmentBuilderContext = createContext<AssessmentBuilderContextType | undefined>(undefined);

// Create the Provider component
export const AssessmentBuilderProvider = ({ children }: { children: React.ReactNode }) => {
  const [assessment, setAssessment] = useState<Assessment>(SAMPLE_ASSESSMENT);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
  const [selectedSectionTitle, setSelectedSectionTitle] = useState<string | null>(null);

  const addSection = useCallback(() => {
    const newSection: Section = {
      id: `sec-${Date.now()}`,
      title: `Section ${assessment.sections.length + 1}`,
      questions: [],
    };
    setAssessment(prev => ({ ...prev, sections: [...prev.sections, newSection] }));
  }, [assessment.sections.length]);

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
        console.log("Saving Assessment:", assessment);
        alert('Assessment saved to console!');
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

 

   const selectedQuestion = assessment.sections.flatMap(s => s.questions).find(q => q.id === selectedQuestionId);

  // The value that will be available to all consumer components
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
    handleDelete
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