'use client';
import SurveyCreatorWidget from "../../components/SurveyCreator";
import { useLocation } from "react-router-dom";

export default function FormsBuilder() {
  const location = useLocation();


  return (
    <div className="flex flex-col h-screen ">
      <div className="flex-1 overflow-y-auto">
        <SurveyCreatorWidget
        />
      </div>

    </div>
  );
}