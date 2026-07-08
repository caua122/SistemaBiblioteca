const form = document.getElementById("formEmprestimo");
const lista = document.getElementById("listaEmprestimos");
const selectUsuario = document.getElementById("usuario");
const selectLivro = document.getElementById("livro");

// Preenche os dropdowns com os usuários e livros já cadastrados
async function carregarOpcoes() {

    const [resUsuarios, resLivros] = await Promise.all([
        fetch("/api/usuarios"),
        fetch("/api/livros")
    ]);

    const usuarios = await resUsuarios.json();
    const livros = await resLivros.json();

    selectUsuario.innerHTML = '<option value="">Selecione o usuário</option>' +
        usuarios.map(u => `<option value="${u.id}">${u.nome}</option>`).join("");

    selectLivro.innerHTML = '<option value="">Selecione o livro</option>' +
        livros.map(l => `<option value="${l.id}">${l.titulo}</option>`).join("");
}

async function carregarEmprestimos() {

    const res = await fetch("/api/emprestimos");
    const dados = await res.json();

    lista.innerHTML = "";

    dados.forEach(e => {

        lista.innerHTML += `
            <div class="item-lista">
                <div class="info">
                    <strong>${e.usuario}</strong> — ${e.livro}<br>
                    Status: ${e.status}
                    ${
                        e.status !== "Ativo"
                        ? `<br><small>Devolvido em ${e.data_devolucao ?? ""}</small>`
                        : ""
                    }
                </div>
                ${
                    e.status === "Ativo"
                    ? `<div class="acoes"><button type="button" class="btn-sm" onclick="devolver(${e.id})">Devolver</button></div>`
                    : ""
                }
            </div>
        `;
    });
}

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    if (!selectUsuario.value || !selectLivro.value) {
        alert("Selecione um usuário e um livro.");
        return;
    }

    const res = await fetch("/api/emprestimos", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            usuario_id: Number(selectUsuario.value),
            livro_id: Number(selectLivro.value)
        })
    });

    if (!res.ok) {
        const erro = await res.json();
        alert(erro.mensagem || "Erro ao registrar empréstimo.");
        return;
    }

    form.reset();
    carregarEmprestimos();
});

async function devolver(id) {

    await fetch(`/api/emprestimos/devolver/${id}`, {
        method: "PUT"
    });

    carregarEmprestimos();
}

carregarOpcoes();
carregarEmprestimos();