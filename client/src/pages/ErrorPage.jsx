import { useNavigate } from 'react-router-dom';
import style from '../css/Login.module.css';
import { Button, Header } from '../components';
import NoConnection from '../assets/images/no-connection.svg';
import { useOnlineStatus } from '../hooks';

// Simplified ErrorPage now shows a No Internet Connection visual + button.
export default function ErrorPage() {
    const navigate = useNavigate();
    const isOnline = useOnlineStatus();

    return (
        <div className="w-full min-h-screen bg-gray-100 flex flex-col">
            <div className="w-full mx-auto pt-6 px-6">
                {/* header */}
                <div className="flex justify-start">
                    <Header theme="dark" />
                </div>
            </div>

            <div className="flex-grow flex items-center justify-center px-6 pb-20">
                {!isOnline && (
                    <>
                        <div className="max-w-md w-full text-center">
                            <div className="mx-auto w-40 h-40 relative select-none">
                                <img src={NoConnection} alt="No internet connection" className="w-full h-full object-contain drop-shadow-md" draggable="false" />
                            </div>

                            <div className="mt-8 space-y-3">
                                <h1 className="text-2xl font-semibold text-gray-800 tracking-tight">No Internet Connection</h1>
                                <p className="text-sm text-gray-500 leading-relaxed">It looks like you're offline. Please check your network settings or try reconnecting. Once you're back online, you can return to the dashboard.</p>
                            </div>

                            <div className="mt-10">
                                <Button onClick={() => navigate('/dashboard' || '/')} className="w-full">Go to Home</Button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

