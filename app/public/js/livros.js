const form = document.getElementById("formLivro");
const lista = document.getElementById("listaLivros");
const campoId = document.getElementById("livroId");
const campoTitulo = document.getElementById("titulo");
const campoAutor = document.getElementById("autor");
const campoCategoria = document.getElementById("categoria");
const btnSalvar = document.getElementById("btnSalvar");
const btnCancelar = document.getElementById("btnCancelar");

async function carregarLivros() {

    const resposta = await fetch("/api/livros");

    const livros = await resposta.json();

    lista.innerHTML = "";

    livros.forEach(livro => {

        lista.innerHTML += `
            <div class="item-lista">
                <div class="info">
                    <strong>${livro.titulo}</strong><br>
                    ${livro.autor} — ${livro.categoria}
                </div>
                <div class="acoes">
                    <button type="button" class="btn-sm btn-editar" onclick='iniciarEdicao(${JSON.stringify(livro)})'>Editar</button>
                    <button type="button" class="btn-sm btn-remover" onclick="removerLivro(${livro.id})">Remover</button>
                </div>
            </div>
        `;

    });

}

// Preenche o formulário com os dados do livro selecionado e entra em modo edição
function iniciarEdicao(livro) {

    campoId.value = livro.id;
    campoTitulo.value = livro.titulo;
    campoAutor.value = livro.autor;
    campoCategoria.value = livro.categoria;

    btnSalvar.textContent = "Salvar alterações";
    btnCancelar.style.display = "block";

    window.scrollTo({ top: 0, behavior: "smooth" });
}

function sairDoModoEdicao() {

    campoId.value = "";
    form.reset();

    btnSalvar.textContent = "Cadastrar";
    btnCancelar.style.display = "none";
}

btnCancelar.addEventListener("click", sairDoModoEdicao);

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const dados = {
        titulo: campoTitulo.value,
        autor: campoAutor.value,
        categoria: campoCategoria.value
    };

    const emEdicao = campoId.value !== "";

    const resposta = await fetch(
        emEdicao ? `/api/livros/${campoId.value}` : "/api/livros",
        {
            method: emEdicao ? "PUT" : "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dados)
        }
    );

    if (!resposta.ok) {
        const erro = await resposta.json();
        alert(erro.mensagem || "Erro ao salvar livro.");
        return;
    }

    sairDoModoEdicao();
    carregarLivros();

});

async function removerLivro(id) {

    const confirmar = confirm("Tem certeza que deseja remover este livro?");

    if (!confirmar) return;

    await fetch(`/api/livros/${id}`, {
        method: "DELETE"
    });

    carregarLivros();

}

carregarLivros();