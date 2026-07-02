const form = document.getElementById("formContato");
const lista = document.getElementById("listaMensagens");

async function carregarMensagens() {

    const res = await fetch("/api/contato");
    const mensagens = await res.json();

    lista.innerHTML = "";

    mensagens.forEach(m => {

        lista.innerHTML += `
            <p>
                <strong>${m.nome}</strong> (${m.email})<br>
                ${m.mensagem}<br>
                <small>${m.data}</small>
            </p>
            <hr>
        `;
    });
}

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    await fetch("/api/contato", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            nome: document.getElementById("nome").value,
            email: document.getElementById("email").value,
            mensagem: document.getElementById("mensagem").value
        })
    });

    form.reset();
    carregarMensagens();
});

carregarMensagens();