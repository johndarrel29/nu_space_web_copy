import { Button } from '../../../components';
import { useNavigate } from 'react-router-dom';

// TODO: make the drag file working
// map the data

export default function AdminTemplates() {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-start w-full relative">
            {/* back navigation */}
            <div
                onClick={() => {
                    navigate(-1);
                }}
                className='absolute top-0 left-2 flex items-center justify-center rounded-full h-8 w-8 cursor-pointer border border-gray-300 group'>
                <svg xmlns="http://www.w3.org/2000/svg" className='fill-gray-600 size-4 group-hover:fill-off-black' viewBox="0 0 448 512"><path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" /></svg>
            </div>

            <div className="flex flex-col w-[800px] justify-center mb-4">
                {/* Uploading Station */}
                <div className="flex flex-col items-center justify-center w-full h-[200px] bg-gray-100 rounded mb-4">
                    <h2 className="text-md">Upload or Drag a Document</h2>
                </div>

                {/* Heading */}
                <div className='flex justify-between items-center mb-4'>
                    <h1>Templates</h1>
                    <Button style={"secondary"}>Filter</Button>
                </div>

                {/* Templates List */}
                <div className='w-full bg-white rounded border border-mid-gray p-4 flex justify-between items-center gap-4 cursor-pointer hover:bg-gray-100'>
                    <div className='flex gap-4 items-center'>
                        <p>
                            1
                        </p>
                        <div className='flex flex-col'>
                            <h1 className='font-bold'>Document Name</h1>
                            <h2 className='text-gray-600 text-sm'>Activity Document</h2>
                        </div>
                    </div>
                    <h1 className='text-gray-600 text-sm'>24MB</h1>
                </div>

            </div>
        </div>
    );
}