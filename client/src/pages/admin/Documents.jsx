import { Outlet } from 'react-router-dom';

export default function Documents() {
    return (
        <div className="border border-mid-gray bg-white rounded-lg p-4">
            <Outlet />
        </div>
    );
}