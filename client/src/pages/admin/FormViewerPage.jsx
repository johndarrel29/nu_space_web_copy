import { React, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import FormViewer from '../../components/FormViewer';
import { MainLayout } from '../../components';
import PreLoader from '../../components/Preloader';
import { toast } from 'react-toastify';

function FormViewerPage() {
    const [formJson, setFormJson] = useState(null);
    const [loading, setLoading] = useState(true);
    const { formId } = useParams();

    useEffect(() => {
        const savedForm = localStorage.getItem(`survey-json`);
        if (savedForm) {
            try {
                setFormJson(JSON.parse(savedForm));
                setLoading(false);

            } catch (error) {
                console.error('Error loading form:', error);
                toast.error('Failed to load form. Please try again later.');

            }
        } else {
            toast.error('Form not found. Please check the form ID.');
        } setLoading(false);
    }, [formId]);

    const handleFormSubmit = (data) => {
        console.log('Form submitted:', data);
        toast.success('Form submitted successfully!');
    };

    if (loading) return <PreLoader />;

    return (
        // <MainLayout>
        //     {formJson ? (
        //         <div>
        //             <h1>Reviewing RSO Activity Form:</h1>
        //             <FormViewer formJson={formJson} onComplete={handleFormSubmit}></FormViewer>
        //         </div>
        //     ) : (
        //         <div className="text-center">
        //             <h2>Form not found</h2>
        //             <p>Please check the form ID and try again.</p>
        //         </div>
        //     )}
        // </MainLayout>
        <div>
            temporarily disabled
        </div>
    );
}

export default FormViewerPage;