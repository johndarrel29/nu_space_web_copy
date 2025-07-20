import { ReusableTable, ReusableDropdown } from '../../components';
import React from 'react';
import { NumberPane } from '../../components';

export default function Dashboard() {

  return (
    <>
      <div className='flex flex-col md:flex-row justify-start items-center mb-4 gap-4'>
        <div className='h-24 w-[15rem] bg-mid-gray rounded-md'></div>
        <div className='h-24 w-[15rem] bg-mid-gray rounded-md'></div>
        <div className='h-24 w-[15rem] bg-mid-gray rounded-md'></div>
      </div>
      <div className='flex flex-col md:flex-row justify-start items-center mt-8 mb-4 gap-4'>
        <div className='w-full h-64 bg-mid-gray rounded-md'></div>
        <div className='w-full h-64 bg-mid-gray rounded-md'></div>
      </div>
    </>
  );
}
