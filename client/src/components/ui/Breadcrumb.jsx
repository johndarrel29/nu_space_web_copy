
import { Link, useLocation } from "react-router-dom";

export default function Breadcrumb (){
    const location = useLocation();
    const paths = location.pathname.split("/").filter(Boolean);

    return (
        <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">

                {paths.map((path, index) => {
                    const routeTo = `/${paths.slice(0, index + 1).join("/")}`;
                    const isLast = index === paths.length - 1;
                    const isFirst = index === 0;

                    return (
                        <li key={routeTo} aria-current={isLast ? "page" : undefined}>
                            <div className="flex items-center">
                                
                                {isFirst ? (null 
                                ) : (
                                    <svg className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                                </svg>
                                )
                                }
                                {isLast ? (
                                    <span className="ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400">{path}</span>
                                ) : (
                                    <Link to={routeTo} className="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white">
                                        {path}
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