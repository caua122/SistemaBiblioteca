const form = document.getElementById("formEmprestimo");
const lista = document.getElementById("listaEmprestimos");

async function carregarEmprestimos() {

    const res = await fetch("/api/emprestimos");
    const dados = await res.json();

    lista.innerHTML = "";

    dados.forEach(e => {

        lista.innerHTML += `
            <p>
                <strong>Usuário:</strong> ${e.usuario}<br>
                <strong>Livro:</strong> ${e.livro}<br>
                <strong>Status:</strong> ${e.status}<br>

                ${
                    e.status === "Ativo"
                    ? `<button onclick="devolver(${e.id})">Devolver</button>`
                    : `<small>Devolvido em ${e.dataDevolucao}</small>`
                }
            </p>
            <hr>
        `;
    });
}

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    await fetch("/api/emprestimos", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            usuario: document.getElementById("usuario").value,
            livro: document.getElementById("livro").value
        })
    });

    form.reset();
    carregarEmprestimos();
});

async function devolver(id) {

    await fetch(`/api/emprestimos/devolver/${id}`, {
        method: "PUT"
    });

    carregarEmprestimos();
}

carregarEmprestimos();