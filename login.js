import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyCE9rLPJb6yquVNcLqVoHJAiPXk-33eeFo",
    authDomain: "login-example-abf20.firebaseapp.com",
    projectId: "login-example-abf20",
    storageBucket: "login-example-abf20.appspot.com",
    messagingSenderId: "620711411544",
    appId: "1:620711411544:web:2c042f20fb6e99f7fb2f2d"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        if (user.emailVerified) {
            alert("✅ Login successful!");
            window.location.href = '../index.html';
        } else {
            await signOut(auth); // sign out the session
            alert("⚠️ Please verify your email before logging in.\nCheck your inbox or spam folder for the verification email.");
        }

    } catch (error) {
        console.error("Login Error:", error);
        alert("❌ Login failed: " + error.message);
    } finally {
        passwordInput.value = ""; // Clear password field for security
    }
});
