import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'

function Badge({ style, text }) {
    const [ handleStyle, setHandleStyle ] = React.useState("bg-blue-100 text-blue-800")
    React.useEffect(() => {
      switch (style) {
          case "primary":
              // Golden Yellow: Associated with energy, optimism, and draws attention.
              setHandleStyle("bg-yellow-100 text-yellow-800");
              break;
          case "secondary":
              // Royal Blue: Trust, stability, and professionalism.
              setHandleStyle("bg-blue-100 text-blue-800");
              break;
          case "tertiary":
              // Emerald Green: Growth, harmony, and subtle positivity.
              setHandleStyle("bg-green-100 text-green-800");
              break;
          case "quarternary":
              // Warm Gray: Neutral, soft contrast for least priority.
              setHandleStyle("bg-gray-200 text-black-700");
              break;
          default:
              // Fallback to a calm neutral tone.
              setHandleStyle("bg-slate-400/10 text-slate-700");
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