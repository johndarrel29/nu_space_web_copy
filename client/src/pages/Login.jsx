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
            <h1>Login Page</h1>
        </div>

        <div className={style['login-container']}>
            <div className={style.username}>
                <TextInput placeholder="Username" />
            </div>
            <div className={style.password}>
                <TextInput placeholder="Password" type="password"/>
            </div>
            {/* insert button here */}
            <Button label="Login" />
            
        </div>

    </div>
    <div className={style['right-container']}> 
        <h1>Test lang po</h1>
    </div>
    </div>

    );

    
}

