'use client';
import SurveyCreatorWidget from "../../components/SurveyCreator";

export default function FormsBuilder() {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1">
        <SurveyCreatorWidget />
      </div>
    </div>
  );
}