import { Link, useNavigate } from 'react-router-dom';
import style from '../css/Login.module.css';
import classNames from 'classnames';
import Background from  "../assets/images/login-background.png";
import Logo from "../assets/images/logo.png";
import User from "../assets/images/user-icon.png";
import { TextInput, Button, Header } from "../components";
import { useState } from 'react';
import axios from 'axios';
import { useKeyBinding } from '../hooks';

export default function Login () {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    




    const handleLogin = async () => {
        
        if (!email || !password) {
            setError("Email and Password are required.");
            return;
          }

        setIsLoading(true);
        setError("");
        
        try {
            const response = await axios.post(`${process.env.REACT_APP_LOGIN_URL}`, 
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

                const role = response.data.user.role;
                if (role === "admin") {

                    navigate("/dashboard"); 
                }
                else if (role === "student/rso") {
                    navigate("/document"); 
                } else if (role === "superadmin") {
                    navigate("/user-management"); 
                }

            } else {
                setError(response.data.message || "Invalid Login Credentials");
            }

        } catch (error) {
            console.error("Login Error:", error.response?.data?.message || "An unknown error occurred");
            setError(error.response?.data?.message || "Failed to login. Please check your credentials.");
        }

    };

    useKeyBinding(
        {key: "Enter", 
            callback: () => {
             handleLogin();
            },
                
             dependencies: [email, password]

        });
    
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
                    setError("");
                    setIsLoading(false);
                    }}/>

                {/* Error Message */}
                {error && (
                    <p className="mt-2 text-sm text-red-600">
                        {error}
                    </p>
                )}

            <Button  onClick={handleLogin} className="w-full mt-6 flex items-center justify-center"> 
                {isLoading ? (
                    <svg aria-hidden="true" class="w-6 h-6 text-primary-rso animate-spin dark:text-gray-200 fill-primary" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                    </svg>
                ) : (<p>Login</p>)}
            </Button>
            
        </div>
    </div>

    <div className={classNames(style['right-container'], 'relative')}> 
        <img src={Background} alt="Background Image" className="w-full h-full object-cover" />
        <img src={Logo} alt="Logo Image" draggable="false" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-80 motion-preset-focus  motion-duration-800 "/>
    </div>
    </div>

    );

    
}

