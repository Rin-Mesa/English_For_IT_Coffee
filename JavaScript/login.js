function login() {
    let user = document.getElementById("username").value;
    let pass = document.getElementById("password").value;
    let errorElement = document.getElementById("error");

    if (user === "" || pass === "") {
        errorElement.innerText = "Please enter both username and password!";
        return;
    }

    if (user === "admin" && pass === "admin123") {
        localStorage.setItem("role", "admin");
        window.location.href = "HTML/home.html";
    }
    else if (user === "user" && pass === "user123") {
        localStorage.setItem("role", "user");
        window.location.href = "HTML/home.html";
    }
    else {
        errorElement.innerText = "Invalid login!";
    }
}
