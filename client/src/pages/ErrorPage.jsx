import { useNavigate } from 'react-router-dom';
import style from '../css/Login.module.css';
import classNames from 'classnames';
import Background from  "../assets/images/login-background.png";
import Logo from "../assets/images/logo.png";
import { Button, Header } from "../components";


export default function ErrorPage () {
    const navigate = useNavigate();

    return(
    <div className={classNames(style.container, style.clearfix)}>
    <div className={`${style["left-container"]} w-full md:w-1/3 pt-6`}>
        <div className={style.heading}>
            <Header theme="dark" />
        </div>

        <div className={style['login-container']}>
                <div className={style['small-text-container']}>
                    <h1 className={style['small-text']}>Error 404</h1>
                </div>



                <div className={style['small-text-container']}>
                    <h1 className={style['small-text']}
                    >Page not found</h1>
                </div>


                

            <Button onClick={() => navigate("/dashboard")}className="w-full mt-6"> Go to Home </Button>
            
        </div>
    </div>

    <div className={classNames(style['right-container'], 'relative')}> 
        <img src={Background} alt="Background Image" className="w-full h-full object-cover" />
        <img src={Logo} alt="Logo Image" draggable="false" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-80 motion-preset-focus  motion-duration-800 "/>
    </div>
    </div>

    );

    
}

