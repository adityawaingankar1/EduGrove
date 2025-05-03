// verify.js (OPTIONAL – only if you want to show countdown or message)

window.addEventListener("DOMContentLoaded", () => {
    const message = document.getElementById("message");
    let seconds = 10;

    const interval = setInterval(() => {
        seconds--;
        message.textContent = `After verifying, you can log in. Redirecting to login in ${seconds} seconds...`;

        if (seconds <= 0) {
            clearInterval(interval);
            window.location.href = "http://127.0.0.1:5500/login/login.html";
        }
    }, 1000);
});
