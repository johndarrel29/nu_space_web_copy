import React from 'react';
import { gsap } from "gsap";
import { useLayoutEffect } from 'react';
import logo from '../assets/images/logo.png';

function Preloader() {

    useLayoutEffect(() => {
    //add fading animation
    gsap.to(".preloader", {
      duration: 1,
      autoAlpha: 0,
      ease: "none",
      delay: 3
    });

    }, []);

  return (
    <div className="preloader flex justify-center items-center h-screen bg-[#314095] fixed top-0 left-0 z-50 w-full">

        <img src={logo} alt="logo"/>
    </div>
  )
}

export default Preloader