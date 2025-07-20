import { React, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import FormViewer from '../../components/FormViewer';
import { MainLayout } from '../../components';
import PreLoader from '../../components/Preloader';
import { toast } from 'react-toastify';
import { useSurvey } from '../../hooks';
import { useLocation } from 'react-router-dom';

function FormViewerPage() {
    const [formJson, setFormJson] = useState(null);
    const [loading, setLoading] = useState(true);
    const { formId } = useParams();
    const location = useLocation();
    const { activityId, activityName, rsoId } = location.state || {};
    const {
        activitySurveys,
        isLoadingSurveys,
        isErrorSurveys,
        surveysError,
    } = useSurvey(activityId);

    console.log("Activity Surveys:", activitySurveys);
    console.log("Actual survey data: ", activitySurveys?.surveys[0]?.surveyJSON);


    const storedSurvey = activitySurveys?.surveys[0]?.surveyJSON;
    useEffect(() => {
        if (isLoadingSurveys) {
            return;
        }

        if (storedSurvey && !isLoadingSurveys) {
            try {
                // Check if storedSurvey is already an object or needs parsing
                if (typeof storedSurvey === 'string') {
                    setFormJson(JSON.parse(storedSurvey));
                } else {
                    // It's already an object, use it directly
                    setFormJson(storedSurvey);
                }
            } catch (error) {
                console.error("Error parsing survey JSON:", error);
                toast.error('Failed to load form. Please try again later.');
            }
        }
        else if (!isLoadingSurveys) {
            // Only show error if we're done loading and there's no survey
            toast.error('Form not found. Please check the form ID.');
            setLoading(false);
        }
        setLoading(false);
    }, [storedSurvey, isLoadingSurveys]);

    const handleFormSubmit = (data) => {
        console.log('Form submitted:', data);
        toast.success('Form submitted successfully!');
    };

    if (loading) return <PreLoader />;

    return (
        <MainLayout>
            {formJson ? (
                <div>
                    <h1>Reviewing RSO Activity Form:</h1>
                    <FormViewer formJson={formJson} onComplete={handleFormSubmit}></FormViewer>
                </div>
            ) : (
                <div className="text-center">
                    <h2>Form not found</h2>
                    <p>Please check the form ID and try again.</p>
                </div>
            )}
        </MainLayout>
        // <div>
        //     temporarily disabled
        // </div>
    );
}

export default FormViewerPage;