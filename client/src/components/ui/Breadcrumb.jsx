
import { Link, useLocation } from "react-router-dom";

export default function Breadcrumb ({ style, unSelected }){
    const location = useLocation();
    const paths = location.pathname.split("/").filter(Boolean);

    if (location.state?.fromRequirements) {
        paths.splice(-1, 0, "requirements");
    }
    
    const capitalize = (str) => {
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
                                    <svg className="rtl:rotate-180 w-3 h-3 text-gray-500 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                                </svg>
                                )
                                }
                                {isLast ? (
                                    <span className={style}>{capitalize(path)}</span>
                                ) : (
                                    <Link to={routeTo} className={unSelected}>
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