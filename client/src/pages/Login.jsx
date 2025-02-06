import TextInput from "../components/TextInput"
import { Link, useNavigate } from 'react-router-dom';
import style from '../css/Login.module.css';
import classNames from 'classnames';
import Button from '../components/Button';
import Header from "../components/Header";
import Background from  "../assets/images/login-background.png";
import Logo from "../assets/images/logo.png";



export default function Login () {
    return(
    <div className={classNames(style.container, style.clearfix)}>
    <div className={`${style["left-container"]} w-full md:w-1/3`}>
        <div className={style.heading}>
            <Header />
        </div>

        <div className={style['login-container']}>
                <div className={style['small-text-container']}>
                    <h1 className={style['small-text']}>Username</h1>
                </div>
                <TextInput placeholder="Username" />
                <div className={style['small-text-container']}>
                    <h1 className={style['small-text']}>Password</h1>
                </div>
                <TextInput placeholder="Password" type="password"/>
                    <Button label="Sign in"/>
            
        </div>
    </div>

    <div className={classNames(style['right-container'], 'relative')}> 
        <img src={Background} alt="Background Image" className="w-full h-full object-cover" />
        <img src={Logo} alt="Logo Image" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-80 motion-preset-focus  motion-duration-800 "/>
    </div>
    </div>

    );

    
}

