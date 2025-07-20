"use client";

import "survey-core/survey-core.css";
import "survey-creator-core/survey-creator-core.css";

import { useState } from "react";
import { SurveyCreator } from "survey-creator-react";
import { SurveyCreatorComponent } from "survey-creator-react"
import { useEffect } from "react";
import SurveyCreatorTheme from "survey-creator-core/themes";
import { registerCreatorTheme } from "survey-creator-core";
import PreLoader from "../components/Preloader";
import { Button } from "../components";
import { useUserProfile, useModal, useSurvey } from "../hooks"
import { useLocation } from "react-router-dom";
import { TextInput } from "../components";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
// get the id survey from the URL
// get props from the parent component
// props should contain the activityId and options for the SurveyCreator

// temporarily disable button until the survey is saved

// remove title and description model as it is already handled by the SurveyCreator
// remove data from the local storage after successful submission

registerCreatorTheme(SurveyCreatorTheme);

const defaultCreatorOptions = {
    autoSaveEnabled: true,
    collapseOnDrag: true,
}

export default function SurveyCreatorWidget(props) {
    const [creator, setCreator] = useState(null);
    const localStorageKey = "survey-json";
    const { userProfile } = useUserProfile();
    const location = useLocation();
    const { activityId, activityName, rsoId } = location.state || {};
    const { isOpen, openModal, closeModal } = useModal();
    const [title, setTitle] = useState(activityName ? `${activityName} Survey` : "");
    const [description, setDescription] = useState("");
    const navigate = useNavigate();
    const {
        createActSurveyMutate,
        isCreatingSurvey,
        isCreateSurveyError,
        createSurveyError
    } = useSurvey();

    console.log("Activity ID:", activityId);
    console.log("Activity Name:", activityName);
    console.log("RSO ID:", rsoId);


    console.log("User Profile rso:", userProfile?.rso?._id);



    useEffect(() => {

        if (!creator) {
            const newCreator = new SurveyCreator(props.options || defaultCreatorOptions);

            newCreator.saveSurveyFunc = (saveNo, callback) => {
                window.localStorage.setItem(localStorageKey, newCreator.text);
                callback(saveNo, true);
            }

            setCreator(newCreator);
        }
    }, [props.options]);

    const handleSubmitForm = () => {

        if (!creator) return;

        const surveyJson = creator.JSON;
        console.log("submitting form", {
            title,
            description,
            activityId,
            rsoId: userProfile?.rso?._id || rsoId,
            surveyJson,
        })
        // post request to save the survey JSON
        createActSurveyMutate({
            activityId,
            title,
            description,
            userId: rsoId,
            surveyJSON: surveyJson
        },
            {
                onSuccess: (data) => {
                    console.log("Survey created successfully:", data);
                    closeModal();
                    // Also clear localStorage here if you want
                    localStorage.removeItem(localStorageKey);
                    toast.success("Survey created successfully");
                    // navigate -1
                    navigate(-1);


                },
                onError: (error) => {
                    console.error("Error creating survey:", error);
                }
            }
        );
    }




    if (!creator) return <PreLoader />;

    return (
        <>
            <div className="w-full h-screen">
                <SurveyCreatorComponent creator={creator} />
                <div className="flex justify-center items-center gap-4 bg-white h-16 absolute bottom-0 w-full">
                    {/* check if there is data from local storage */}
                    {window.localStorage.getItem(localStorageKey) && (
                        <div className="w-full absolute bg-white/50 h-16"></div>
                    )}
                    <Button style={"secondary"}>Cancel Form</Button>
                    <Button onClick={() => openModal()}>Submit Form</Button>
                </div>
            </div>
            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded shadow-lg">
                        <h2 className="text-lg font-semibold mb-4">Create Survey</h2>
                        <p>{`Create a title and description before submitting.`}</p>
                        <div className="mt-4 flex flex-col gap-4">
                            <TextInput
                                label="Survey Title"
                                placeholder="Enter survey title"
                                value={title}
                                onChange={(e) => {
                                    setTitle(e.target.value);
                                }}
                            />

                            <textarea
                                rows={4}
                                name="description"
                                id="description"
                                placeholder="Enter survey description"
                                className="bg-textfield border border-mid-gray text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}></textarea>
                        </div>
                        {createSurveyError && (
                            <div className="text-red-500 mt-2">
                                {isCreateSurveyError ? createSurveyError.message : "An error occurred while creating the survey."}
                            </div>
                        )}
                        <div className="mt-4 flex justify-end gap-2">
                            <Button onClick={closeModal} style={"secondary"}>Cancel</Button>
                            <Button onClick={
                                handleSubmitForm
                            }> Confirm</Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}