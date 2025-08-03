import { Link, useNavigate } from 'react-router-dom';
import style from '../css/Login.module.css';
import classNames from 'classnames';
import User from "../assets/images/user-icon.png";
import { TextInput, Button } from "../components";
import { useState } from 'react';
import { useKeyBinding, useUser } from '../hooks';
import { useAuth } from "../context/AuthContext";



export default function MainLogin() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { loginUserMutate } = useUser();
    const { login } = useAuth();


    const handleLogin = async () => {
        console.log("email ", email, "password", password, "platform", "web");

        if (!email || !password) {
            setError("Email and Password are required.");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            // Using the custom hook to handle login
            const res = await loginUserMutate.mutateAsync({
                email: email,
                password: password,
                platform: "web",
            });

            // Add detailed logging to see the full response structure
            console.log("Full login response:", res);

            // Decode JWT token to get user information
            if (res?.token) {
                try {
                    const tokenPart = res.token.replace('Bearer ', '');
                    const base64Payload = tokenPart.split('.')[1];
                    const decodedPayload = JSON.parse(atob(base64Payload));
                    console.log("Decoded token payload:", decodedPayload);

                    const role = decodedPayload.role || decodedPayload.userRole || decodedPayload.type;
                    console.log("User role from token:", role);

                    login({
                        token: res.token,
                        id: decodedPayload.id,
                        email: decodedPayload.email || email,
                        role: role,
                        ...decodedPayload
                    });

                    if (role === "admin" || role === "coordinator") {
                        navigate("/dashboard");
                    } else if (role === "rso_representative") {
                        navigate("/document");
                    } else if (role === "super_admin") {
                        navigate("/users");
                    } else if (role === "director" || role === "avp") {
                        navigate("/admin-documents");
                    } else {
                        setError("Invalid role or access denied.");
                    }
                } catch (tokenError) {
                    console.error("Error decoding token:", tokenError);
                    setError("Login successful but unable to decode user information.");
                }
            } else {
                setError("Login failed: No token received.");
            }

        } catch (err) {
            console.error("Login error details:", {
                message: err.message,
                status: err.status,
                response: err.response?.data,
                stack: err.stack
            });

            // Provide more specific error messages
            if (err.message.includes('403')) {
                setError("Invalid email or password. Please check your credentials.");
            } else if (err.message.includes('404')) {
                setError("Login service unavailable. Please try again later.");
            } else {
                setError(err.message || "Login failed. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };


    useKeyBinding(
        {
            key: "Enter",
            callback: () => {
                handleLogin();
            },

            dependencies: [email, password]

        });

    return (
        <div className={style['login-container']}>
            <div className={style['small-text-container']}>
                <h1 className={"text-sm font-medium text-gray-700 mb-1"}>Email</h1>
            </div>
            <div className="relative w-full">
                <svg xmlns="http://www.w3.org/2000/svg" className='fill-primary size-4 absolute top-3 right-3 z-10 bg-gray-300 rounded-full' viewBox="0 0 512 512"><path d="M399 384.2C376.9 345.8 335.4 320 288 320l-64 0c-47.4 0-88.9 25.8-111 64.2c35.2 39.2 86.2 63.8 143 63.8s107.8-24.7 143-63.8zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm256 16a72 72 0 1 0 0-144 72 72 0 1 0 0 144z" /></svg>
                <TextInput
                    placeholder="Email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                        setError("");
                    }}
                />
            </div>


            <div className={style['small-text-container']}>
                <h1 className={"text-sm font-medium text-gray-700 mb-1"}
                >Password</h1>
            </div>
            <TextInput
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                    setIsLoading(false);
                }}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        handleLogin();
                    }
                }}
            />

            {/* Error Message */}
            {error && (
                <p className="mt-2 text-sm text-red-600">
                    {error}
                </p>
            )}
            <div className='flex flex-col gap-4 w-full mt-4'>
                <Button
                    autoFocus
                    onClick={handleLogin}
                    className="w-full mt-6 flex items-center justify-center">
                    {isLoading ? (
                        <svg aria-hidden="true" className="w-6 h-6 text-white animate-spin dark:text-gray-200 fill-primary" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                        </svg>
                    ) : (<p>Login</p>)}
                </Button>
                <div className='w-full h-[1px] bg-mid-gray'></div>
                <Button
                    style={"secondary"}
                    onClick={() => navigate("/register")}
                    className="w-full flex items-center justify-center"
                >
                    Register
                </Button>
            </div>

        </div>
    );
}