import type { Assessment } from "../features/assessments/types"
import { ConfigurationPanel } from "../features/assessments/components/ConfigurationPanel";
import { PreviewPanel } from "../features/assessments/components/PreviewPanel";
import { AssessmentBuilderProvider } from "@/features/assessments/context/AssessmentContext";

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

export const AssessmentBuilder = ()=>{

    return (
      <AssessmentBuilderProvider>
        <div className="builder-container">
            <div className="config-panel border-r-3 border-gray-400">
                <ConfigurationPanel  ></ConfigurationPanel>
            </div>
            <div className="preview-panel">
                <PreviewPanel  />
            </div>
        </div>
      </AssessmentBuilderProvider>
    )
}