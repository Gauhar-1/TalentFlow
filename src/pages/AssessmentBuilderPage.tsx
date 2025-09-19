import { LoadingScreeen } from "@/components/shared/LoadinScreen";
import { ConfigurationPanel } from "../features/assessments/components/ConfigurationPanel";
import { PreviewPanel } from "../features/assessments/components/PreviewPanel";
import { AssessmentBuilderProvider, useAssessmentBuilder } from "@/features/assessments/context/AssessmentContext";


const AssessmentBuilderUi = ()=>{
  const { isSaving, isLoading, assessment } =useAssessmentBuilder();

  if(isSaving || isLoading || !assessment) return <LoadingScreeen />

  return (
    <div className="builder-container">
            <div className="config-panel border-r-3 border-gray-400">
                <ConfigurationPanel ></ConfigurationPanel>
            </div>
            <div className="preview-panel">
                <PreviewPanel/>
            </div>
        </div>
  )
}

export const AssessmentBuilder = ()=>{
  
    return (
      <AssessmentBuilderProvider>
        <AssessmentBuilderUi />
      </AssessmentBuilderProvider>
    )
}