function login() {
    let user = document.getElementById("username").value;
    let pass = document.getElementById("password").value;

    if (user === "admin" && pass === "admin123") {
        localStorage.setItem("role", "admin");
        window.location.href = "admin.html";
    }
    else if (user === "user" && pass === "user123") {
        localStorage.setItem("role", "user");
        window.location.href = "user.html";
    }
    else {
        document.getElementById("error").innerText = "Invalid login!";
    }
}
