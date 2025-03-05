import { Link, useNavigate } from 'react-router-dom';
import style from '../css/Login.module.css';
import classNames from 'classnames';
import Background from  "../assets/images/login-background.png";
import Logo from "../assets/images/logo.png";
import User from "../assets/images/user-icon.png";
import { TextInput, Button, Header } from "../components";




export default function Login () {
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate("/dashboard"); 
    };
    
    return(
    <div className={classNames(style.container, style.clearfix)}>
    <div className={`${style["left-container"]} w-full md:w-1/3 pt-6`}>
        <div className={style.heading}>
            <Header theme="dark" />
        </div>

        <div className={style['login-container']}>
                <div className={style['small-text-container']}>
                    <h1 className={style['small-text']}>Username</h1>
                </div>
                <div className="relative w-full">
                    <img src={User} alt="User" draggable="false" className='absolute right-3 top-1/2 transform -translate-y-1/2 h-4'/>
                    <TextInput placeholder="Username" className='pr-10'/>
                </div>
                <div className={style['small-text-container']}>
                    <h1 className={style['small-text']}>Password</h1>
                </div>
                <TextInput placeholder="Password" type="password"/>
                    <Button label="Sign in" onClick={handleLogin}/>
            
        </div>
    </div>

    <div className={classNames(style['right-container'], 'relative')}> 
        <img src={Background} alt="Background Image" className="w-full h-full object-cover" />
        <img src={Logo} alt="Logo Image" draggable="false" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-80 motion-preset-focus  motion-duration-800 "/>
    </div>
    </div>

    );

    
}

