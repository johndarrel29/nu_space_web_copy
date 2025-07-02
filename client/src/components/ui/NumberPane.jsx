

function NumberPane({ title, number }) {
    return (
        <div className="h-100 w-60 border border-mid-gray bg-white rounded-md grid grid-cols-2 p-3">
            <h2 className="col-span-5 text-gray-600 text-md">{title}</h2>


            <h1 className=" text-[30px]" >{number}</h1>
            {/* <h1 className="underline text-white cursor-pointer hover:opacity-60 col-span-4 place-self-end font-bold" title="View details">View details</h1> */}

        </div>
    );
}


export default NumberPane;
