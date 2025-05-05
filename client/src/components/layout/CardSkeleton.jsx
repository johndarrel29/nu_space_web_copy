import React from 'react'
import Skeleton from 'react-loading-skeleton'

function CardSkeleton() {
  return (
    <>
        <div className="min-w-full rounded-md border border-gray-400 p-4 h-screen">
        <Skeleton height={30} style={{marginBottom: ".6rem"}}/>
        <Skeleton height={40} count={10}/>
        </div>
    </>
  )
}

export default CardSkeleton