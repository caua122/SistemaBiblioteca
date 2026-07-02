const form = document.getElementById("formLivro");
const lista = document.getElementById("listaLivros");

async function carregarLivros() {

    const resposta = await fetch("/api/livros");

    const livros = await resposta.json();

    lista.innerHTML = "";

    livros.forEach(livro => {

        lista.innerHTML += `
            <p>
                <strong>${livro.titulo}</strong><br>
                Autor: ${livro.autor}<br>
                Categoria: ${livro.categoria}
            </p>
            <hr>
        `;

    });

}

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    await fetch("/api/livros", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({

            titulo: document.getElementById("titulo").value,

            autor: document.getElementById("autor").value,

            categoria: document.getElementById("categoria").value

        })

    });

    form.reset();

    carregarLivros();

});

carregarLivros();