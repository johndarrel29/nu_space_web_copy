import { Button } from '../../../components';

export default function DocumentDetails() {
    return (
        <div className="flex flex-col items-center justify-start w-full ">
            <div className="flex flex-col w-[800px] justify-center mb-4">

                {/* Document Detail */}
                <div className='w-full bg-white rounded border border-mid-gray p-4 flex justify-between items-center gap-4 cursor-pointer hover:bg-gray-100'>
                    <div className='flex gap-4 items-center'>
                        <div className='flex flex-col'>
                            <h1 className='font-bold'>Document Name</h1>
                            <h2 className='text-gray-600 text-sm'>Activity Document</h2>
                        </div>
                    </div>
                    <h1 className='text-gray-600 text-sm'>24MB</h1>
                </div>

                {/* Description */}
                <div className='w-full flex flex-col justify-start'>
                    <h1>title</h1>
                    <h2>description</h2>
                    <h2>RSO Name</h2>
                    <h2>Size</h2>
                    <h2>Type</h2>
                </div>

                {/* Actions */}
                <div className='w-full flex justify-start items-center mt-4'>
                    Actions
                </div>
                <div className='w-full rounded bg-mid-gray h-[100px]'>
                    input message actions
                </div>
                <div className='w-full flex justify-end items-center gap-4 mt-4'>
                    <Button style={"secondary"}>Reject</Button>
                    <Button>Approve</Button>
                </div>

            </div>
        </div>
    );
}
