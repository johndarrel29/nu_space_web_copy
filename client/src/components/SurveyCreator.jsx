"use client";

import "survey-core/survey-core.css";
import "survey-creator-core/survey-creator-core.css";
import { ICreatorOptions } from "survey-creator-core";
import { useState } from "react";
import { SurveyCreator } from "survey-creator-react";
import { SurveyCreatorComponent } from "survey-creator-react"
import { useEffect } from "react";
import SurveyCreatorTheme from "survey-creator-core/themes";
import { registerCreatorTheme } from "survey-creator-core";
import PreLoader from "../components/Preloader";

// get the id survey from the URL
// get props from the parent component
// props should contain the activityId and options for the SurveyCreator

registerCreatorTheme(SurveyCreatorTheme);

const defaultCreatorOptions = {
    autoSaveEnabled: true,
    collapseOnDrag: true,
}

export default function SurveyCreatorWidget(props) {
    const [creator, setCreator] = useState(null);
    const localStorageKey = "survey-json-example";
    const activityId = props.activityId || "default-activity-id";

    useEffect(() => {

        if (!creator) {
            const newCreator = new SurveyCreator(props.options || defaultCreatorOptions);

            newCreator.saveSurveyFunc = (saveNo, callback) => {
                window.localStorage.setItem(localStorageKey, newCreator.text);
                callback(saveNo, true);

                // If you use a web service:
                // saveSurveyJson(
                //     "https://your-web-service.com/",
                //     newCreator.JSON,
                //     saveNo,
                //     callback
                // );

                // post request to save the survey JSON
                // fetch(`${process.env.REACT_APP_BASE_URL}/createSurvey/${activityId}`, {
                //     method: 'POST',
                //     headers: {
                //         'Content-Type': 'application/json',
                //         Authorization: localStorage.getItem("token"),
                //         'platform': 'web',
                //     },
                //     body: JSON.stringify({ surveyJson: newCreator.JSON }),
                // })
            }

            setCreator(newCreator);
        }
    }, [props.options]);


    if (!creator) return <PreLoader />;

    return (
        <div className="w-full h-screen">
            <SurveyCreatorComponent creator={creator} />
        </div>
    );
}