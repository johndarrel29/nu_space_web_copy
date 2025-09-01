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
import { useUserProfile, useModal, useSurvey, useAdminCentralizedForms } from "../hooks"
import { useLocation } from "react-router-dom";
import { TextInput } from "../components";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

// error: show confirm even tho the data remained unchange
// remove the academic year field


// cant show the yearid. dont make the academic year available or adjust data

// replace local storage with react state.
// store state with backend data

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
    const location = useLocation();
    const [surveyMode, setSurveyMode] = useState("create");
    const { activityId, activityName, rsoId, formId } = location.state || {};
    const {
        // create form
        createFormMutate,
        isCreatingForm,
        isCreatingFormError,
        createFormError,

        // fetch specific
        specificForm,
        isLoadingSpecificForm,
        isErrorSpecificForm,
        specificFormError,

        // edit forms
        editFormMutate,
        isEditingForm,
        isEditingFormError,
        editFormError,


    } = useAdminCentralizedForms(formId);

    console.log("title form ", specificForm?.form?.title);
    console.log("survey mode ", surveyMode);

    const [temporaryData, setTemporaryData] = useState({
        title: "",
        description: "",
        formType: "",
        formJSON: null,
    });

    const { userProfile } = useUserProfile();

    const { isOpen, openModal, closeModal } = useModal();
    const [title, setTitle] = useState(activityName ? `${activityName} Survey` : "");
    const [description, setDescription] = useState("");
    const navigate = useNavigate();
    const {
        createActSurveyMutate,
        isCreatingSurvey,
        isCreateSurveyError,
        createSurveyError,

        activitySurveys,
        isLoadingSurveys,
        isErrorSurveys,
        surveysError,
    } = useSurvey(activityId);

    console.log("form ID:", formId, "the data of the id: ", specificForm?.form?.formJSON);
    console.log("Activity Surveys:", activitySurveys);
    console.log("User Profile rso:", userProfile?.rso?._id);

    useEffect(() => {
        if (surveyMode === "edit" && formId) {
            setTemporaryData({
                title: specificForm?.form?.title || "",
                description: specificForm?.form?.description || "",
                formType: specificForm?.form?.formType || "",
                formJSON: specificForm?.form?.formJSON || null,
            });
        }
    }, [formId, specificForm, surveyMode]);

    useEffect(() => {
        if (isLoadingSurveys) {
            console.log("Loading surveys from API...");
            return;
        }

        // Set surveyMode to "edit" if editing an existing form
        if (formId && specificForm?.form?.formJSON && surveyMode !== "edit") {
            setSurveyMode("edit");
        }

        if (!creator && !isLoadingSurveys) {
            const newCreator = new SurveyCreator(props.options || defaultCreatorOptions);

            newCreator.saveSurveyFunc = (saveNo, callback) => {
                setTemporaryData(prev => ({
                    ...prev,
                    formJSON: newCreator.JSON
                }));
                callback(saveNo, true);
            }
            if (formId && specificForm?.form?.formJSON) {
                try {
                    newCreator.JSON = specificForm.form.formJSON;
                    newCreator.text = JSON.stringify(newCreator.JSON, null, 2);
                } catch (error) {
                    console.error("Error parsing specific form JSON:", error);
                }
            }

            // create forms if no existing survey
            else if (activitySurveys?.surveys?.length > 0 && activitySurveys.surveys[0]?.surveyJSON) {
                try {
                    newCreator.JSON = activitySurveys.surveys[0].surveyJSON;
                    newCreator.text = JSON.stringify(newCreator.JSON, null, 2);
                } catch (error) {
                    console.error("Error parsing survey JSON:", error);

                }
                // fetch temporary data from local storage if no existing survey
            } else if (temporaryData?.formJSON?.pages?.length > 0) {
                // newCreator.text = window.localStorage.getItem();
                newCreator.JSON = JSON.parse(newCreator.text);

            }

            setCreator(newCreator);
        }


    }, [activitySurveys, isLoadingSurveys, props.options, formId, specificForm, surveyMode]);

    useEffect(() => {
        console.log("Temporary Data:", {
            ...temporaryData,
            formJSON: temporaryData.formJSON,
        });
    }, [temporaryData]);

    const handleSubmitForm = () => {

        if (!creator) return;
        // ensure all fields are filled
        if (!temporaryData.title || !temporaryData.description || !temporaryData.formJSON) {
            console.error("All fields are required");
            toast.error("All fields are required");
            return;
        }

        const surveyJson = creator.JSON;
        console.log("submitting form", temporaryData)

        if (surveyMode === "create") {
            createFormMutate(temporaryData, {
                onSuccess: (data) => {
                    console.log("Form created successfully:", data);
                    closeModal();
                    // clear state
                    setTemporaryData({
                        title: "",
                        description: "",
                        formJSON: {
                            pages: []
                        }
                    });
                    navigate(-1);
                    toast.success("Form created successfully");
                },
                onError: (error) => {
                    console.error("Error creating form:", error);
                }
            })
        }

        if (surveyMode === "edit" && formId) {
            console.log("received edit mutate. sending: ", { formData: temporaryData, formId });
            editFormMutate({ formData: temporaryData, formId }, {
                onSuccess: (data) => {
                    console.log("Form edited successfully:", data);
                    closeModal();
                    // clear state
                    setTemporaryData({
                        title: "",
                        description: "",
                        formJSON: {
                            pages: []
                        }
                    });
                    navigate(-1);
                    toast.success("Form edited successfully");
                },
                onError: (error) => {
                    console.error("Error editing form:", error);
                }
            })
        }

    }

    const handleExit = () => {
        navigate(-1);
    }

    if (!creator) return <PreLoader />;

    return (
        <>
            <div className="w-full h-screen">
                <SurveyCreatorComponent creator={creator} />
                <div className="flex justify-center items-center gap-4 bg-white h-16 absolute bottom-0 w-full">
                    {/* check if there is data from local storage */}
                    {console.log("did the json show? :", temporaryData?.formJSON?.pages?.length > 0 ? "true" : "false")}
                    {(temporaryData?.formJSON?.pages?.length > 0 === false && !(surveyMode === "edit")) && (
                        <div className="w-full absolute bg-white/50 h-16"></div>
                    )}
                    <Button style={"secondary"} onClick={handleExit}>Cancel Form</Button>
                    <Button onClick={() => openModal()}>{`Submit ${surveyMode === "edit" ? "Editing " : "New "} Form`}</Button>
                </div>
            </div>
            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    {console.log("edit form data ", temporaryData)}
                    <div className="bg-white p-6 rounded shadow-lg">
                        <h2 className="text-lg font-semibold mb-4">Create Survey</h2>
                        <p>{`Create a title and description before submitting.`}</p>
                        <div className="mt-4 flex flex-col gap-4">
                            <TextInput
                                label="Survey Title"
                                placeholder="Enter survey title"
                                value={temporaryData.title}
                                onChange={(e) => {
                                    setTemporaryData({ ...temporaryData, title: e.target.value });
                                }}
                            />

                            <textarea
                                rows={4}
                                name="description"
                                id="description"
                                placeholder="Enter survey description"
                                className="bg-textfield border border-mid-gray text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                value={temporaryData.description}
                                onChange={(e) => setTemporaryData({ ...temporaryData, description: e.target.value })}></textarea>


                            {/* NEW: Form Type dropdown */}
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700 mb-1">Form Type</label>
                                <select
                                    value={temporaryData.formType}
                                    onChange={(e) => setTemporaryData({ ...temporaryData, formType: e.target.value })}
                                    className="bg-textfield border border-mid-gray text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                >
                                    <option value="" disabled>Select form type</option>
                                    <option value="pre-activity">Pre-Activity Forms</option>
                                    <option value="post-activity">Post-Activity Forms</option>
                                    <option value="membership">Membership Forms</option>
                                </select>
                            </div>
                        </div>
                        {createSurveyError && (
                            <div className="text-red-500 mt-2">
                                {isCreateSurveyError ? createSurveyError.message : "An error occurred while creating the survey."}
                            </div>
                        )}
                        <div className="mt-4 flex justify-end gap-2">
                            <Button onClick={closeModal} style={"secondary"}>Cancel</Button>
                            <Button onClick={handleSubmitForm}> Confirm</Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}