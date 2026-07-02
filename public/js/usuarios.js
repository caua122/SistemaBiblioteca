const form = document.getElementById("formUsuario");
const lista = document.getElementById("listaUsuarios");

async function carregarUsuarios() {

    const res = await fetch("/api/usuarios");
    const usuarios = await res.json();

    lista.innerHTML = "";

    usuarios.forEach(u => {

        lista.innerHTML += `
            <p>
                <strong>${u.nome}</strong><br>
                Email: ${u.email}<br>
                Tipo: ${u.tipo}
            </p>
            <hr>
        `;
    });
}

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    await fetch("/api/usuarios", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            nome: document.getElementById("nome").value,
            email: document.getElementById("email").value,
            tipo: document.getElementById("tipo").value
        })
    });

    form.reset();
    carregarUsuarios();
});

carregarUsuarios();