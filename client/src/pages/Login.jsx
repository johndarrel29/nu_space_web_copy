import { Link, useNavigate } from 'react-router-dom';
import style from '../css/Login.module.css';
import classNames from 'classnames';
import Background from  "../assets/images/login-background.png";
import Logo from "../assets/images/logo.png";
import User from "../assets/images/user-icon.png";
import { TextInput, Button, Header } from "../components";
import { useState } from 'react';
import axios from 'axios';

export default function Login () {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");


    const handleLogin = async () => {
        
        if (!email || !password) {
            setError("Email and Password are required.");
            return;
          }
        
    // store url in .env
    // api endpoint to .env
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}`, 
                {
                    email: email,
                    password: password,
                    platform: "web",
                },
                {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            console.log("button clicked", response);

            if (response.data.success && response.status == 200) {
                console.log("Login Successful: ", response.data);

                localStorage.setItem("token", response.data.token);
                localStorage.setItem("user", JSON.stringify(response.data.user));

                navigate("/dashboard"); 

            } else {
                setError(response.data.message || "Invalid Login Credentials");
            }

        } catch (error) {
            console.error("Login Error:", error.response?.data?.message || "An unknown error occurred");
            setError(error.response?.data?.message || "Failed to login. Please check your credentials.");
        }

    };
    
    return(
    <div className={classNames(style.container, style.clearfix)}>
    <div className={`${style["left-container"]} w-full md:w-1/3 pt-6`}>
        <div className={style.heading}>
            <Header theme="dark" />
        </div>

        <div className={style['login-container']}>
                <div className={style['small-text-container']}>
                    <h1 className={style['small-text']}>Email</h1>
                </div>
                <div className="relative w-full">
                    <img src={User} alt="User" draggable="false" className='absolute right-3 top-1/2 transform -translate-y-1/2 h-4'/>
                <TextInput placeholder="Email" className={classNames('pr-10 w-full p-[10px_20px] block  box-border rounded-[7px]', error ? 'border border-red-500' : 'border border-dark-gray')}
                value={email}
                onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");}}/>
                </div>


                <div className={style['small-text-container']}>
                    <h1 className={style['small-text']}
                    >Password</h1>
                </div>
                <TextInput 
                placeholder="Password" 
                type="password"
                className={classNames('pr-10 w-full p-[10px_20px] block  box-border rounded-[7px]', error ? 'border border-red-500' : 'border border-dark-gray')}
                value={password}
                onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");}}/>

                {/* Error Message */}
                {error && (
                    <p className="mt-2 text-sm text-red-600">
                        {error}
                    </p>
                )}

            <Button onClick={handleLogin} className="w-full mt-6"> Login </Button>
            
        </div>
    </div>

    <div className={classNames(style['right-container'], 'relative')}> 
        <img src={Background} alt="Background Image" className="w-full h-full object-cover" />
        <img src={Logo} alt="Logo Image" draggable="false" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-80 motion-preset-focus  motion-duration-800 "/>
    </div>
    </div>

    );

    
}

