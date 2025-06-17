import { Outlet } from 'react-router-dom';
import defaultPic from '../../assets/images/default-profile.jpg';
import { useLocation } from 'react-router-dom'


export default function MainActivities() {
  const location = useLocation()
  const { activity } = location.state || {}; 

    return (
    <>
        <Outlet />
    </>
    );


  }