import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
import { getAuth, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-auth.js";

// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyCE9rLPJb6yquVNcLqVoHJAiPXk-33eeFo",
    authDomain: "login-example-abf20.firebaseapp.com",
    projectId: "login-example-abf20",
    storageBucket: "login-example-abf20.appspot.com",
    messagingSenderId: "620711411544",
    appId: "1:620711411544:web:2c042f20fb6e99f7fb2f2d",
    measurementId: "G-8YF8GX9H0G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Handle reset form
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const emailInput = document.getElementById('email');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = emailInput.value.trim();

        if (!email) {
            alert("Please enter your email.");
            return;
        }

        try {
            await sendPasswordResetEmail(auth, email);
            alert("✅ A password reset link has been sent to your email. Please check your inbox (and spam folder).");
            window.location.href = "../login/login.html";
        } catch (error) {
            if (error.code === "auth/user-not-found") {
                alert("⚠️ No account found with this email.");
            } else if (error.code === "auth/invalid-email") {
                alert("⚠️ Please enter a valid email address.");
            } else {
                alert("❌ Error: " + error.message);
            }
        }
    });
});
