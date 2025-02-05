import TextInput from "../components/TextInput"
import { Link, useNavigate } from 'react-router-dom';
import style from '../css/Login.module.css';
import classNames from 'classnames';
import Button from '../components/Button';


export default function Login () {
    return(
    <div className={classNames(style.container, style.clearfix)}>
    <div className={style['left-container']}>
        <div className={style.heading}>
            <h1 className="text-3xl font-bold underline">Login Page</h1>
        </div>

        <div className={style['login-container']}>
                <div className={style['small-text-container']}>
                    <h1 className={style['small-text']}>Login</h1>
                </div>
                <TextInput placeholder="Username" />
                <div className={style['small-text-container']}>
                    <h1 className={style['small-text']}>Password</h1>
                </div>
                <TextInput placeholder="Password" type="password"/>
                    <Button label="Login"/>
            
        </div>

    </div>
    <div className={style['right-container']}> 
        <h1>Test lang po</h1>
    </div>
    </div>

    );

    
}

