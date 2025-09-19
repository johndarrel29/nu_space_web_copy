
import { Link, useLocation, useParams } from "react-router-dom";
import { useActivities, useAdminDocuments, useRSODocuments } from "../../hooks";
import { useUserStoreWithAuth } from "../../store";
import classNames from "classnames";

export default function Breadcrumb({ style, unSelected }) {
    const location = useLocation();
    const paths = location.pathname.split("/").filter(Boolean);
    const { isUserRSORepresentative, isUserAdmin } = useUserStoreWithAuth();
    const { activityId, documentId } = useParams();
    const {
        specificDocument,
        specificDocumentLoading,
        specificDocumentError,
    } = useRSODocuments({ documentId });
    const {
        documentDetail,
        documentDetailLoading,
        documentDetailError,
        documentDetailQueryError,
        refetchDocumentDetail,
        isDocumentDetailRefetching,
    } = useAdminDocuments({ documentId });


    const { viewActivityData } = useActivities(activityId);

    console.log("specificDocument:", specificDocument?.title);
    console.log("documentDetail:", documentDetail);
    console.log("Breadcrumb viewActivityData:", viewActivityData);
    console.log("act id", activityId);
    console.log("path name ", viewActivityData?.Activity_name);



    // if (location.state?.fromRequirements) {
    //     paths.splice(-1, 0, "requirements");
    // }

    const capitalize = (str) => {
        if (str === activityId) {
            return viewActivityData?.Activity_name || "...loading"; // Use the activity name if available
        }
        if (str === documentId && isUserRSORepresentative) {
            return specificDocument?.title || "...loading"; // Use the document title if available
        }
        if (str === documentId && !isUserRSORepresentative) {
            return documentDetail?.document?.title || "...loading"; // Use the document title if available
        }

        return str
            .split('-')
            .map(word =>
                word.toLowerCase() === 'rso'
                    ? 'RSO' // Special case for "Rso"
                    : word.charAt(0).toUpperCase() + word.slice(1)
            )
            .join('-');
    }

    return (
        <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1  rtl:space-x-reverse">

                {paths.map((path, index) => {
                    { console.log("Breadcrumb path:", path); }
                    const routeTo = `/${paths.slice(0, index + 1).join("/")}`;
                    const isLast = index === paths.length - 1;
                    const isFirst = index === 0;

                    return (
                        <li key={routeTo} aria-current={isLast ? "page" : undefined}>
                            <div className="flex items-center">

                                {isFirst ? (null
                                ) : (
                                    <svg className="rtl:rotate-180 w-3 h-3 mx-2 text-[#656565]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                                    </svg>
                                )
                                }
                                {isLast ? (
                                    <span className={classNames(style)}>{capitalize(path)}</span>
                                ) : (
                                    <Link
                                        state={documentId ? { documentId } : undefined}
                                        to={routeTo} className={unSelected}>
                                        {capitalize(path)}
                                    </Link>
                                )}
                            </div>
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}