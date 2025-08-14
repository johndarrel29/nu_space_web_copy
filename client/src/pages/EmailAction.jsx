import { useNavigate, useLocation } from "react-router-dom";
import { TextInput, Button } from "../components";
import { useState, useEffect } from "react";
import { useLogin } from "../hooks";
import { toast } from "react-toastify";
import OTPInput from "../components/ui/OTPInput";

// before sending code, check email exists, then send code
// after sending code, user fill up the code and submit
// then verify the code
// when successful, redirect to main login page

// add state for storing value email

// enhancement: add loading states and error handling, add timer after sending code to prevent spamming

export default function EmailAction() {
    const navigate = useNavigate();
    const location = useLocation();
    const { email = "", fromLogin = false } = location.state || {};
    const [formData, setFormData] = useState({
        email: email || "",
        code: ""
    });
    const {
        checkEmailExistsMutate,
        isCheckEmailExistsLoading,
        isCheckEmailExistsError,
        checkEmailExistsError,
        checkEmailExistsData,

        // send code verification mutation
        sendCodeVerificationMutate,
        isSendCodeVerificationLoading,
        isSendCodeVerificationError,
        sendCodeVerificationError,
        sendCodeVerificationData,

        // verify email code mutation
        verifyEmailCodeMutate,
        isVerifyEmailCodeLoading,
        isVerifyEmailCodeError,
        verifyEmailCodeError,
        verifyEmailCodeData,
    } = useLogin();

    useEffect(() => {
        console.log("Location state:", location.state);
    }, [location.state]);

    useEffect(() => {
        console.log("Code updated:", formData.code);
    }, [formData.code]);

    const handleVerifyCode = () => {
        // Handle email verification logic here
        console.log("fromLogin? ", location.state.fromLogin);
        verifyEmailCodeMutate({ email: formData.email, code: formData.code },
            {
                onSuccess: (data) => {
                    console.log("Email code verified successfully:", data);
                    toast.success("Email code verified successfully");
                    // Navigate to the next step or show success message
                    if (fromLogin === true) {
                        navigate("../password-action", {
                            state: {
                                email: formData.email,
                                fromLogin: fromLogin
                            }
                        })
                    } else {
                        navigate("/");
                    }
                },
                onError: (error) => {
                    console.error("Error verifying email code:", error);
                    toast.error(error.message || "Failed to verify email code. Please try again.");
                }
            }
        )
    }

    const handleSendCode = () => {
        const { email } = formData;
        if (!email) {
            alert("Email is required to send code.");
            return;
        }
        checkEmailExistsMutate(email,
            {
                onSuccess: (data) => {
                    console.log("Email action successful:", data);
                    toast.success("Email action successful");

                    sendCodeVerificationMutate(email,
                        {
                            onSuccess: (data) => {
                                console.log("Code sent successfully:", data);
                                toast.success("Code sent to your email");
                            },
                            onError: (error) => {
                                console.error("Error sending code verification:", error);
                                toast.error("Failed to send code. Please try again.");
                            }
                        }
                    );
                },
                onError: (error) => {
                    console.error("Error during email action:", error);
                    alert("An error occurred. Please try again.");
                    toast.error("Email action failed");
                }
            }
        );

    }

    return (
        <div className="flex flex-col items-center justify-center gap-4 w-full">
            <div className="w-full justify-start flex items-center justify-start gap-2 mb-4">
                <div
                    onClick={() => {
                        navigate(-1);
                    }}
                    className='flex items-center justify-center rounded-full h-8 w-8 cursor-pointer border border-gray-300 group'>
                    <svg xmlns="http://www.w3.org/2000/svg" className='fill-gray-600 size-4 group-hover:fill-off-black' viewBox="0 0 448 512"><path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" /></svg>
                </div>
                <h1 className="text-lg font-semibold">Email Action</h1>
            </div>
            {/* Email and Code Input */}
            <div className="flex flex-col w-full gap-4 mb-4">
                <div>
                    <label htmlFor="email" className="text-sm text-gray-600">Email</label>
                    <div className="relative w-full">
                        <TextInput
                            placeholder="Email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            id="email"
                        />
                        <Button onClick={handleSendCode} style={"secondary"} className={"absolute right-0 top-0 px-2"}>Send Code</Button>
                    </div>
                </div>
                <div>
                    <label htmlFor="code" className="text-sm text-gray-600">Code</label>
                    {/* <TextInput
                        placeholder="Code"
                        value={formData.code}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                        id="code"
                    /> */}
                    <OTPInput
                        value={formData.code}
                        onChange={(code) => {
                            console.log("OTP code changed:", code);
                            setFormData(prev => ({
                                ...prev,
                                code: code // Use the string value directly
                            }));
                        }}
                        length={5}
                    />


                </div>
                <Button className={"mt-4"} onClick={handleVerifyCode}>Confirm</Button>
            </div>
        </div>
    );
}