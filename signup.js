// signup.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification
} from "https://www.gstatic.com/firebasejs/10.7.2/firebase-auth.js";

// Firebase config
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

document.getElementById('signupForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  try {
    // Step 1: Create user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Step 2: Try signing in immediately to confirm credentials
    await signInWithEmailAndPassword(auth, email, password);

    // Step 3: Only send verification if the login is successful
    if (!user.emailVerified) {
      await sendEmailVerification(user);
      alert('✅ A verification email has been sent. Please check your inbox.');
    }

    // Redirect to verification page
    window.location.href = 'http://127.0.0.1:5500/verify/verify.html';

  } catch (error) {
    if (error.code === "auth/email-already-in-use") {
      alert("⚠️ This email is already registered. Please log in instead.");
    } else if (error.code === "auth/weak-password") {
      alert("⚠️ Password must be at least 6 characters.");
    } else {
      alert("❌ Signup failed: " + error.message);
    }
  }
});
