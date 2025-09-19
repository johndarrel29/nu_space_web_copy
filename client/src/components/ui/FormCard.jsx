import { Searchbar, Button } from '../../components';


// Reusable FormCard component extracted from map for cleanliness
export default function FormCard({ form, isUserRSORepresentative, selectedForms, handleRSOSelectedForm, navigate, handleDelete, getFormTypeBadgeClass, FormatDate }) {
    return (
        <div key={form.id} className="bg-white rounded-lg border border-gray-300 hover:border-gray-500 transition-shadow">
            <div className="p-6">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800">{form.title || <span className="text-gray-400">Untitled Form</span>}</h3>
                        <span
                            className={`inline-block mt-2 px-2 py-1 text-xs font-semibold rounded-full ${getFormTypeBadgeClass(form.formType)}`}
                        >
                            {form.formType
                                ? form.formType.charAt(0).toUpperCase() + form.formType.slice(1)
                                : <span className="text-gray-400">Unknown Type</span>}
                        </span>
                    </div>
                </div>
                <p className="text-gray-600 text-sm mt-4">Created on: {FormatDate(form.createdAt)}</p>
                <div className="flex justify-between mt-6 pt-4 border-t border-gray-100">
                    <button
                        onClick={() => {
                            navigate(`/form-viewer`, { state: { formId: form._id } })
                            console.log("Viewing form:", form);
                        }}
                        className="text-gray-600 hover:text-gray-900 font-medium text-sm flex items-center gap-1"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        View
                    </button>
                    {!isUserRSORepresentative && (
                        <>
                            <button
                                onClick={() => navigate(`/forms-builder`, { state: { formId: form._id } })}
                                className="text-gray-500 hover:text-gray-800 font-medium text-sm flex items-center gap-1"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(form._id, form.title)}
                                className="text-gray-400 hover:text-gray-700 font-medium text-sm flex items-center gap-1"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Delete
                            </button>
                        </>
                    )}

                    {isUserRSORepresentative && (
                        <>
                            <Button
                                style={form._id === (selectedForms.feedbackForm && selectedForms.feedbackForm._id) || form._id === (selectedForms.preActForm && selectedForms.preActForm._id) ? "secondary" : "primary"}
                                onClick={() => handleRSOSelectedForm(form)}
                            >
                                <div className='flex gap-2 items-center'>
                                    {`${form._id === (selectedForms.feedbackForm && selectedForms.feedbackForm._id) ? "(Feedback)" : form._id === (selectedForms.preActForm && selectedForms.preActForm._id) ? "(Pre-Activity)" : "Select Form"}`}
                                    {form._id === (selectedForms.feedbackForm && selectedForms.feedbackForm._id) || form._id === (selectedForms.preActForm && selectedForms.preActForm._id) ?
                                        <svg xmlns="http://www.w3.org/2000/svg" className='size-5 fill-gray-400' viewBox="0 0 640 640"><path d="M320 576C461.4 576 576 461.4 576 320C576 178.6 461.4 64 320 64C178.6 64 64 178.6 64 320C64 461.4 178.6 576 320 576zM231 231C240.4 221.6 255.6 221.6 264.9 231L319.9 286L374.9 231C384.3 221.6 399.5 221.6 408.8 231C418.1 240.4 418.2 255.6 408.8 264.9L353.8 319.9L408.8 374.9C418.2 384.3 418.2 399.5 408.8 408.8C399.4 418.1 384.2 418.2 374.9 408.8L319.9 353.8L264.9 408.8C255.5 418.2 240.3 418.2 231 408.8C221.7 399.4 221.6 384.2 231 374.9L286 319.9L231 264.9C221.6 255.5 221.6 240.3 231 231z" /></svg>
                                        :
                                        ""}
                                </div>
                            </Button>
                            {console.log("Selected Forms inside button:", selectedForms)}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}