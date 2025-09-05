import { React, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import FormViewer from '../../../components/FormViewer';
import { MainLayout } from '../../../components';
import PreLoader from '../../../components/Preloader';
import { toast } from 'react-toastify';
import { useSurvey, useAdminSurvey, useAdminCentralizedForms, useRSOForms } from '../../../hooks';
import { useLocation } from 'react-router-dom';
import { useUserStoreWithAuth } from '../../../store'
import { useNavigate } from 'react-router-dom';

// get specific form for rso representative

// still thinking of removing view for RSO Representatives since this route is primarily for Admins
// but for now, we will keep it as is


function FormViewerPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { activityId, activityName, rsoId, formId } = location.state || {};
    const [formJson, setFormJson] = useState(null);
    const [loading, setLoading] = useState(true);
    // const { formId } = useParams();
    const [userDisplay, setUserDisplay] = useState(null);
    const [showSubmitModal, setShowSubmitModal] = useState(false);
    const {
        specificForm,
        isLoadingSpecificForm,
        isErrorSpecificForm,
        specificFormError,
    } = useAdminCentralizedForms(formId);
    const {
        specificRSOForm,
        isLoadingSpecificRSOForm,
        isErrorSpecificRSOForm,
        errorSpecificRSOForm,
    } = useRSOForms(formId);
    const { isUserRSORepresentative, isUserAdmin } = useUserStoreWithAuth();
    const {
        adminActivitySurvey,
        adminActivitySurveyError,
        isadminActivitySurveyLoading,
        isadminActivitySurveyError,
    } = useAdminSurvey({ activityId });
    const {
        activitySurveys,
        isLoadingSurveys,
        isErrorSurveys,
        surveysError,
    } = useSurvey(activityId);

    console.log("specific form data:", specificRSOForm);

    useEffect(() => {
        if (isLoadingSpecificForm) {
            console.log("is loading ", isLoadingSpecificForm);
            console.log("Loading specific form...");
            setLoading(true);
            return;
        }

        if (specificForm && specificForm.form && specificForm.form.formJSON) {
            setFormJson(specificForm.form.formJSON);
            console.log("Specific form loaded:", specificForm.form.formJSON);
            setLoading(false);
        } else if (!isLoadingSpecificForm && formId) {
            toast.error('Form not found. Please check the form ID.');
            setFormJson(null);
            console.error("Form not found:", formId);
            setLoading(false);
            navigate(-1);

        }
    }, [isLoadingSpecificForm, specificForm, formId]);

    console.log("form id: ", formId, "the forms is ", specificForm);
    console.log("Activity Surveys:", activitySurveys);
    console.log("Actual survey data: ", activitySurveys?.surveys[0]?.surveyJSON);

    // useEffect(() => {
    //     if (isUserRSORepresentative) {
    //         setUserDisplay(activitySurveys?.surveys[0]?.surveyJSON);
    //     } else if (isUserAdmin) {
    //         setUserDisplay(adminActivitySurvey?.surveys[0]?.surveyJSON);
    //     } else {
    //         console.error("User is neither RSO Representative nor Admin, redirecting to error page");
    //         toast.error("You do not have permission to view this form.");
    //         return navigate("/error", { replace: true });
    //     }
    // }, [isUserRSORepresentative, isUserAdmin, activitySurveys, adminActivitySurvey]);

    // useEffect(() => {
    //     if (adminActivitySurvey) {
    //         console.log("Admin activity survey data:", adminActivitySurvey);
    //     } else if (!isadminActivitySurveyLoading) {
    //         console.log("No admin activity survey data available.");
    //     }

    //     if (isadminActivitySurveyError && adminActivitySurveyError) {
    //         console.error("Error fetching admin activity survey:", adminActivitySurveyError);
    //         toast.error("Failed to fetch activity survey data.");
    //     }
    // }, [adminActivitySurvey, adminActivitySurveyError, isadminActivitySurveyLoading, isadminActivitySurveyError]);

    // const storedSurvey = userDisplay;

    // useEffect(() => {
    //     if (isLoadingSurveys) {
    //         return;
    //     }

    //     // if (storedSurvey && !isLoadingSurveys) {
    //     //     try {
    //     //         // Check if storedSurvey is already an object or needs parsing
    //     //         if (typeof storedSurvey === 'string') {
    //     //             setFormJson(JSON.parse(storedSurvey));
    //     //         } else {
    //     //             // It's already an object, use it directly
    //     //             setFormJson(storedSurvey);
    //     //         }
    //     //     } catch (error) {
    //     //         console.error("Error parsing survey JSON:", error);
    //     //         toast.error('Failed to load form. Please try again later.');
    //     //     }
    //     // }
    //     if (specificForm) {
    //         setFormJson(specificForm.form.formJSON);
    //     } else if (!specificForm) {
    //         // Only show error if we're done loading and there's no survey
    //         toast.error('Form not found. Please check the form ID.');
    //         setLoading(false);
    //     }
    //     setLoading(false);
    // }, [storedSurvey, isLoadingSurveys]);

    const handleFormSubmit = (data) => {
        setFormJson(data);
        setShowSubmitModal(true);
    };

    const closeSubmitModal = () => {
        setShowSubmitModal(false);
    };

    if (formJson === null) return <PreLoader />;

    return (
        <MainLayout>
            {formJson ? (
                <div className="container mx-auto border rounded-md">
                    <FormViewer formJson={formJson || null} onComplete={handleFormSubmit}></FormViewer>
                </div>
            ) : (
                <div className="text-center">
                    <h2>Form not found</h2>
                    <p>Please check the form ID and try again.</p>
                </div>
            )}
            {/* Submit Info Modal */}
            {showSubmitModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
                        <div className="flex items-center mb-4">
                            <div className="bg-blue-100 rounded-full p-2 mr-3">
                                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" />
                                </svg>
                            </div>
                            <h2 className="text-lg font-semibold text-blue-600">Viewing Mode Only</h2>
                        </div>
                        <p className="text-gray-700">
                            The data you entered will <span className="font-semibold text-red-600">not</span> be saved. This form is for viewing purposes only.
                        </p>
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Your Answers</label>
                            <div className="bg-gray-100 rounded p-3 text-xs text-gray-800 max-h-60 overflow-auto border space-y-2">
                                {formJson && typeof formJson === "object" && Object.keys(formJson).length > 0 ? (
                                    Object.entries(formJson).map(([key, value]) => (
                                        <div key={key} className="flex flex-col mb-2">
                                            <span className="font-semibold text-gray-700">{key}:</span>
                                            {typeof value === "string" ? (
                                                <span className="ml-2 break-all">{value}</span>
                                            ) : value && typeof value === "object" && value.type === "file" ? (
                                                <span className="ml-2 italic text-blue-700">{value.name || "Uploaded file"}</span>
                                            ) : Array.isArray(value) ? (
                                                <span className="ml-2">{value.join(", ")}</span>
                                            ) : (
                                                <span className="ml-2 text-gray-400">[Unsupported field]</span>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <span className="text-gray-400">No answers to display.</span>
                                )}
                            </div>
                        </div>
                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={closeSubmitModal}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            >
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </MainLayout>
        // <div>
        //     temporarily disabled
        // </div>
    );
}

export default FormViewerPage;