import { React, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import FormViewer from '../../../components/FormViewer';
import { MainLayout } from '../../../components';
import PreLoader from '../../../components/Preloader';
import { toast } from 'react-toastify';
import { useSurvey, useAdminSurvey } from '../../../hooks';
import { useLocation } from 'react-router-dom';
import { useUserStoreWithAuth } from '../../../store'
import { useNavigate } from 'react-router-dom';

// still thinking of removing view for RSO Representatives since this route is primarily for Admins
// but for now, we will keep it as is


function FormViewerPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { activityId, activityName, rsoId } = location.state || {};
    const [formJson, setFormJson] = useState(null);
    const [loading, setLoading] = useState(true);
    const { formId } = useParams();
    const [userDisplay, setUserDisplay] = useState(null);
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

    console.log("Activity Surveys:", activitySurveys);
    console.log("Actual survey data: ", activitySurveys?.surveys[0]?.surveyJSON);

    useEffect(() => {
        if (isUserRSORepresentative) {
            setUserDisplay(activitySurveys?.surveys[0]?.surveyJSON);
        } else if (isUserAdmin) {
            setUserDisplay(adminActivitySurvey?.surveys[0]?.surveyJSON);
        } else {
            console.error("User is neither RSO Representative nor Admin, redirecting to error page");
            toast.error("You do not have permission to view this form.");
            return navigate("/error", { replace: true });
        }
    }, [isUserRSORepresentative, isUserAdmin, activitySurveys, adminActivitySurvey]);

    useEffect(() => {
        if (adminActivitySurvey) {
            console.log("Admin activity survey data:", adminActivitySurvey);
        } else if (!isadminActivitySurveyLoading) {
            console.log("No admin activity survey data available.");
        }

        if (isadminActivitySurveyError && adminActivitySurveyError) {
            console.error("Error fetching admin activity survey:", adminActivitySurveyError);
            toast.error("Failed to fetch activity survey data.");
        }
    }, [adminActivitySurvey, adminActivitySurveyError, isadminActivitySurveyLoading, isadminActivitySurveyError]);

    const storedSurvey = userDisplay;

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
                <div className="container mx-auto border rounded-md">
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