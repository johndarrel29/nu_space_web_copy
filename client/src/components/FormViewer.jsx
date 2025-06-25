import React from 'react';
import { Survey } from 'survey-react-ui';
import "survey-core/survey-core.css";
import "survey-creator-core/survey-creator-core.css";

import { Model } from 'survey-core';

const FormViewer = ({ formJson, onComplete }) => {
    // Create form model from JSON
    const survey = new Model(formJson);

    // Handle form completion
    survey.onComplete.add((sender) => {
        if (onComplete) {
            onComplete(sender.data);
        }
    });

    return (
        <div className="form-viewer">
            <Survey model={survey} />
        </div>
    );
}

export default FormViewer;

