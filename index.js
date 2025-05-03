// explore.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-auth.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-firestore.js";

// ✅ Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCE9rLPJb6yquVNcLqVoHJAiPXk-33eeFo",
  authDomain: "login-example-abf20.firebaseapp.com",
  projectId: "login-example-abf20",
  storageBucket: "login-example-abf20.firebasestorage.app",
  messagingSenderId: "620711411544",
  appId: "1:620711411544:web:2c042f20fb6e99f7fb2f2d",
  measurementId: "G-8YF8GX9H0G"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


const authButtons = document.getElementById('auth-buttons');
const profileSection = document.getElementById('profile-section');
const profileIcon = document.getElementById('user-profile');
const dropdown = document.getElementById('dropdown');
const dropdownInitials = document.getElementById('dropdown-initials');
const dropdownName = document.getElementById('dropdown-name');
const dropdownEmail = document.getElementById('dropdown-email');
const signoutBtn = document.getElementById('signout-btn');

// Create initials from name
function getInitials(displayName, email) {
    if (displayName) {
        const parts = displayName.trim().split(" ");
        return parts.length >= 2
            ? (parts[0][0] + parts[1][0]).toUpperCase()
            : parts[0].substring(0, 2).toUpperCase();
    }
    const namePart = email.split('@')[0].replace(/[._]/g, ' ').split(" ");
    return namePart.length >= 2
        ? (namePart[0][0] + namePart[1][0]).toUpperCase()
        : namePart[0].substring(0, 2).toUpperCase();
}

onAuthStateChanged(auth, (user) => {
    if (user) {
        if (authButtons) authButtons.style.display = 'none';
        if (profileSection) profileSection.style.display = 'flex';

        const name = user.displayName || user.email.split('@')[0];
        const initials = getInitials(user.displayName, user.email);

        if (profileIcon) profileIcon.textContent = initials;
        if (dropdownInitials) dropdownInitials.textContent = initials;
        if (dropdownName) dropdownName.textContent = name;
        if (dropdownEmail) dropdownEmail.textContent = user.email;
    } else {
        if (authButtons) authButtons.style.display = 'flex';
        if (profileSection) profileSection.style.display = 'none';
    }
});

// Toggle dropdown
if (profileIcon) {
    profileIcon.addEventListener('click', () => {
        dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
    });
}

// Sign out
if (signoutBtn) {
    signoutBtn.addEventListener('click', () => {
        signOut(auth).then(() => {
            window.location.href = 'http://127.0.0.1:5500/index.html';
        });
    });
}



const feedbackForm = document.getElementById("feedback-form");
const feedbackText = document.getElementById("feedback-text");

feedbackForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const user = auth.currentUser;
  if (!user) {
    alert("Please log in to share your experience.");
    return;
  }

  const text = feedbackText.value.trim();
  if (text === "") return;

  try {
    await addDoc(collection(db, "feedbacks"), {
      uid: user.uid,
      name: user.displayName || user.email,
      email: user.email,
      message: text,
      createdAt: serverTimestamp()
    });

    feedbackText.value = "";
    window.location.href = "Feedback/feedback.html"; // Redirect after submission
  } catch (error) {
    console.error("Error adding feedback:", error);
    alert("Failed to submit feedback. Try again.");
  }
});












