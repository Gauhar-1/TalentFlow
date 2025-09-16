// src/components/CreateAssessment.tsx

import { 
    AlertDialog, 
    AlertDialogAction, 
    AlertDialogCancel, 
    AlertDialogContent, 
    AlertDialogDescription, 
    AlertDialogFooter, 
    AlertDialogHeader, 
    AlertDialogTitle, 
    AlertDialogTrigger 
} from "../ui/alert-dialog";
import { Input } from "../ui/input"; 
import type { Assessment, Section } from "@/features/assessments/types";
import { useAssessmentBuilder } from "@/features/assessments/context/AssessmentContext";

// A simpler blank structure focusing on sections
const BLANK_ASSESSMENT: Assessment = {
    id: `asmt-${Date.now()}`,
    jobTitle: "", // This can be set in a later step or a different input
    sections: [
        {
            id: `sec-${Date.now()}`,
            title: "Section 1",
            questions: []
        }
    ]
};

export const CreateAssessment = ({ children }: { children: React.ReactNode }) => {
    const { assessment , setAssessment } = useAssessmentBuilder();

    const handleAddSection = () => {
        const newSection: Section = {
            id: `sec-${Date.now()}`,
            title: `Section ${assessment.sections.length + 1}`,
            questions: []
        };
        setAssessment({ ...assessment, sections: [...assessment.sections, newSection] });
    };

    const handleSectionTitleChange = (sectionId: string, newTitle: string) => {
        const updatedSections = assessment.sections.map(section => 
            section.id === sectionId ? { ...section, title: newTitle } : section
        );
        setAssessment({ ...assessment, sections: updatedSections });
    };
    
    const handleDeleteSection = (sectionId: string) => {
        const updatedSections = assessment.sections.filter(section => section.id !== sectionId);
        setAssessment({ ...assessment, sections: updatedSections });
    };
    
    const handleCreateAssessment = () => {
        console.log("Creating Assessment with Sections:", assessment);
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger className="bg-green-600 py-1 px-4 text-white shadow-lg rounded">
                {children}
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-lg">
                <AlertDialogHeader>
                    <AlertDialogTitle>Create Assessment Sections</AlertDialogTitle>
                    <AlertDialogDescription>
                        Define the sections for your assessment. You can add questions in the next step.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                {/* --- Main Form Content --- */}
                <div className="space-y-4 h-[20vh] overflow-y-auto pr-2">
                    {assessment.sections.map((section) => (
                        <div key={section.id} className="flex items-center gap-2">
                            <Input 
                                placeholder="Section Title"
                                value={section.title}
                                onChange={(e) => handleSectionTitleChange(section.id, e.target.value)}
                                className="flex-grow"
                            />
                            {/* Only show delete button if there's more than one section */}
                            {assessment.sections.length > 1 && (
                                <button 
                                    onClick={() => handleDeleteSection(section.id)}
                                    className="text-red-500 hover:text-red-700 font-bold px-2"
                                    title="Delete Section"
                                >
                                    &times;
                                </button>
                            )}
                        </div>
                    ))}

                    <button onClick={handleAddSection} className="w-full border-2 border-dashed rounded-md p-2 text-slate-600 hover:bg-slate-100">
                        + Add Another Section
                    </button>
                </div>

                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleCreateAssessment}>Create Assessment</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};