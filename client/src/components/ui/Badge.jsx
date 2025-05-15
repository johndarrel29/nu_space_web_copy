import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'

function Badge({ style, text }) {
    const [ handleStyle, setHandleStyle ] = React.useState("bg-blue-100 text-blue-800")
    React.useEffect(() => {
        switch (style) {
            case "primary":
                setHandleStyle("bg-yellow-100 text-yellow-800")
                break;
            case "secondary":
                setHandleStyle("bg-blue-100 text-blue-800")
                break;
            case "tertiary":
                setHandleStyle("bg-green-100 text-green-800")
                break;
            default:
                setHandleStyle("bg-blue-100 text-blue-800")
        }
    }, [style])

  return (
    <>

      <div className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full color-off-black ${handleStyle}`}>
        {text}
        </div>
    </>
    
  )
}

export default Badge;