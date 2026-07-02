const formulario = document.getElementById("loginForm");

formulario.addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value.trim();

    if (email === "" || senha === "") {
        alert("Preencha todos os campos.");
        return;
    }

    // Login provisório (sem banco de dados)
    window.location.href = "index.html";
});