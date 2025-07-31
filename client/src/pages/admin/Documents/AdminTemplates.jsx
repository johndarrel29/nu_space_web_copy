import { Button } from '../../../components';

export default function AdminTemplates() {
    return (
        <div className="flex flex-col items-center justify-start w-full ">
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