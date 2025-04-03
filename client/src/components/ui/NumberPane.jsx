

function NumberPane ({title, number }) {
    return (
        <div className="box-border h-100 w-60 border-0 bg-[#314095] rounded-md grid grid-cols-2 p-3">
            <h2 className="col-span-5 text-white text-md">{title}</h2>
            
                   
                <h1 className="text-white text-[30px]" >{number}</h1>
                <h1 className="underline text-white cursor-pointer hover:opacity-60 col-span-4 place-self-end font-bold" title="View details">View details</h1>
               
        </div>
    );
}


export default NumberPane;
