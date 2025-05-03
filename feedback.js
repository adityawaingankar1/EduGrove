import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.7.2/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  updateDoc,
  doc,
  increment,
  deleteField
} from "https://www.gstatic.com/firebasejs/10.7.2/firebase-firestore.js";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyCE9rLPJb6yquVNcLqVoHJAiPXk-33eeFo",
  authDomain: "login-example-abf20.firebaseapp.com",
  projectId: "login-example-abf20",
  storageBucket: "login-example-abf20.appspot.com",
  messagingSenderId: "620711411544",
  appId: "1:620711411544:web:2c042f20fb6e99f7fb2f2d",
  measurementId: "G-8YF8GX9H0G"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// DOM Elements
const authButtons = document.getElementById('auth-buttons');
const profileSection = document.getElementById('profile-section');
const profileIcon = document.getElementById('user-profile');
const dropdown = document.getElementById('dropdown');
const dropdownInitials = document.getElementById('dropdown-initials');
const dropdownName = document.getElementById('dropdown-name');
const dropdownEmail = document.getElementById('dropdown-email');
const signoutBtn = document.getElementById('signout-btn');
const feedbackForm = document.querySelector('.newsletter-form');
const feedbackContainer = document.getElementById("feedback-container");

// Get initials
function getInitials(name, email) {
  if (name) {
    const parts = name.trim().split(" ");
    return parts.length >= 2
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : parts[0].substring(0, 2).toUpperCase();
  }
  const username = email.split('@')[0].replace(/[._]/g, ' ');
  const unameParts = username.split(' ');
  return unameParts.length >= 2
    ? (unameParts[0][0] + unameParts[1][0]).toUpperCase()
    : unameParts[0].substring(0, 2).toUpperCase();
}

// Auth state
onAuthStateChanged(auth, (user) => {
  if (user) {
    authButtons.style.display = 'none';
    profileSection.style.display = 'flex';

    const name = user.displayName || user.email.split('@')[0];
    const email = user.email;
    const initials = getInitials(name, email);

    profileIcon.textContent = initials;
    dropdownInitials.textContent = initials;
    dropdownName.textContent = name;
    dropdownEmail.textContent = email;

    const colRef = collection(db, "feedbacks");
    onSnapshot(colRef, (snapshot) => {
      feedbackContainer.innerHTML = "";
      snapshot.docs.forEach((docSnap) => {
        const data = docSnap.data();
        renderFeedback({ ...data, id: docSnap.id }, user);
      });
    });

  } else {
    authButtons.style.display = 'flex';
    profileSection.style.display = 'none';
    dropdown.style.display = 'none';
  }
});

// Toggle dropdown
profileIcon.addEventListener('click', () => {
  dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
});

// Sign out
signoutBtn.addEventListener('click', () => {
  signOut(auth).then(() => {
    window.location.href = 'http://127.0.0.1:5500/index.html';
  });
});

// Submit feedback
feedbackForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const feedbackText = document.getElementById("feedback-text").value.trim();

  if (!feedbackText) {
    alert("Please write something before submitting!");
    return;
  }

  try {
    const user = auth.currentUser;
    if (!user) {
      alert("You must be logged in to submit feedback.");
      return;
    }

    await addDoc(collection(db, "feedbacks"), {
      feedback: feedbackText,
      timestamp: serverTimestamp(),
      name: user.displayName || user.email.split('@')[0],
      email: user.email,
      uid: user.uid,
      likes: 0,
      dislikes: 0,
      userLikes: {}
    });

    alert("Feedback submitted successfully!");
    setTimeout(() => {
      window.location.href = "Feedback/feedback.html";
    }, 1000);

  } catch (error) {
    console.error("Error submitting feedback:", error);
    alert("Something went wrong. Please try again.");
  }
});

// Render feedback cards
function renderFeedback(feedback, user) {
  const card = document.createElement("div");
  card.classList.add("card", "p-3", "mb-3");

  const name = feedback.name || "";
  const email = feedback.email || "Unknown Email";
  const fullName = name && !name.includes("@") ? name : email.split('@')[0];
  const initials = getInitials(fullName, email);
  const response = feedback.feedback || feedback.message || "No response provided";

  let timestamp = "No date";
  try {
    const ts = feedback.createdAt;
    if (typeof ts === "string") {
      timestamp = ts;
    } else if (ts && typeof ts.toDate === "function") {
      timestamp = ts.toDate().toLocaleString();
    } else if (ts?.seconds) {
      timestamp = new Date(ts.seconds * 1000).toLocaleString();
    }
  } catch (e) {
    console.warn("Could not parse timestamp:", e, feedback.createdAt);
  }
  

  const userReaction = feedback.userLikes?.[user?.uid];

  card.innerHTML = `
    <div class="d-flex align-items-center mb-2">
      <div class="profile-icon me-2" style="background-color:#ff595e; color:white; width:40px; height:40px; border-radius:50%; display:flex; align-items:center; justify-content:center;">
        ${initials}
      </div>
      <div>
        <strong>${fullName}</strong><br>
        <small>${email}</small>
      </div>
    </div>
    <p>${response}</p>
    <small>${timestamp}</small>
    <div class="mt-2">
      <button class="btn btn-outline-success btn-sm like-btn ${userReaction === "like" ? "active" : ""}">
        Like (<span class="like-count">${feedback.likes || 0}</span>)
      </button>
      <button class="btn btn-outline-danger btn-sm dislike-btn ${userReaction === "dislike" ? "active" : ""}">
        Dislike (<span class="dislike-count">${feedback.dislikes || 0}</span>)
      </button>
    </div>
  `;

  const likeBtn = card.querySelector(".like-btn");
  const dislikeBtn = card.querySelector(".dislike-btn");
  const docRef = doc(db, "feedbacks", feedback.id);

  likeBtn.addEventListener("click", async () => {
    if (!user) return alert("Login required to like or dislike");
    const userId = user.uid;
    const current = feedback.userLikes?.[userId];

    if (current === "like") {
      await updateDoc(docRef, {
        likes: increment(-1),
        [`userLikes.${userId}`]: deleteField()
      });
    } else {
      const updates = {
        likes: increment(1),
        [`userLikes.${userId}`]: "like"
      };
      if (current === "dislike") updates.dislikes = increment(-1);
      await updateDoc(docRef, updates);
    }
  });

  dislikeBtn.addEventListener("click", async () => {
    if (!user) return alert("Login required to like or dislike");
    const userId = user.uid;
    const current = feedback.userLikes?.[userId];

    if (current === "dislike") {
      await updateDoc(docRef, {
        dislikes: increment(-1),
        [`userLikes.${userId}`]: deleteField()
      });
    } else {
      const updates = {
        dislikes: increment(1),
        [`userLikes.${userId}`]: "dislike"
      };
      if (current === "like") updates.likes = increment(-1);
      await updateDoc(docRef, updates);
    }
  });

  feedbackContainer.appendChild(card);
}