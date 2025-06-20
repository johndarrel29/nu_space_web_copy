import "survey-core/survey-core.css";
import "survey-creator-core/survey-creator-core.css";
// import defaultCreatorOptions from "./yourOptions";
import SurveyCreatorTheme from "survey-creator-core/themes";
import { registerCreatorTheme  } from "survey-creator-core";
import { useState } from "react";
import { SurveyCreator } from "survey-creator-react";
import { SurveyCreatorComponent } from "survey-creator-react";
import { useEffect } from "react";
import PreLoader from '../../components/Preloader';

const defaultCreatorOptions = {
  autoSaveEnabled: true,
  collapseOnDrag: true, 
};


export default function FormsBuilder(props) {
  let [creator, setCreator] = useState();

useEffect(() => {
  const newCreator = new SurveyCreator(props.options || defaultCreatorOptions);
  newCreator.theme = "modern"; // Set the theme to contrast
  setCreator(newCreator);

      // Load from localStorage if available
    const savedSurvey = window.localStorage.getItem("survey-json");
    if (savedSurvey) {
      try {
        newCreator.text = savedSurvey;
      } catch (err) {
        console.error("Invalid JSON in localStorage:", err);
      }
    }

    // Save to localStorage on save
    newCreator.saveSurveyFunc = (saveNo, callback) => {
      window.localStorage.setItem("survey-json", newCreator.text);
      callback(saveNo, true);
    }
}, [props.options]);


if (!creator) return <PreLoader />;

    return (
    <div style={{ height: "100vh", width: "100%" }}>
      <SurveyCreatorComponent creator={creator} />
    </div>
  );
}

