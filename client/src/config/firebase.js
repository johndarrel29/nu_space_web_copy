// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { toast } from "react-toastify";

const firebaseConfig = {
    apiKey: "AIzaSyBAOT2Dezhk1_w-y44-wHEOv_TlJojBjZ0",
    authDomain: "nu-space-7673d.firebaseapp.com",
    projectId: "nu-space-7673d",
    storageBucket: "nu-space-7673d.firebasestorage.app",
    messagingSenderId: "1066124685294",
    appId: "1:1066124685294:web:86a19c4fa492cd16fb28ff",
    measurementId: "G-S3Z46QLDE9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

Notification.requestPermission().then((permission) => {
    if (permission === "granted") {
        getToken(messaging, {
            vapidKey: "BPWciAUT0uZ246BNykgHW6-P0AcnbGzF-I1h16sLBfBEWdOEKRfnx00r1zOWkSrzpdilTflcrQGR57IVZSp0_vc",
        }).then((currentToken) => {
            if (currentToken) {

                console.log('FCM Token:', currentToken);
            }
        });
    }
});

// listen for foreground messages
onMessage(messaging, (payload) => {
    console.log('Message received. ', payload);
})

export const generateToken = async () => {
    const permission = await Notification.requestPermission();

    if (permission === "granted") {
        const token = await getToken(
            messaging, {
            vapidKey:
                "BPWciAUT0uZ246BNykgHW6-P0AcnbGzF-I1h16sLBfBEWdOEKRfnx00r1zOWkSrzpdilTflcrQGR57IVZSp0_vc",
        }).then((currentToken) => {
            if (currentToken) {

                console.log('FCM Token:', currentToken);
            }
        });
    }


}
