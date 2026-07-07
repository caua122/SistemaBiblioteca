async function buscarLivros() {

    const termo = document.getElementById("busca").value;

    const resultadoDiv = document.getElementById("resultado");

    if (!termo) {
        alert("Digite algo para pesquisar");
        return;
    }

    const resposta = await fetch(`/api/livros/buscar/${termo}`);

    const livros = await resposta.json();

    resultadoDiv.innerHTML = "";

    if (livros.length === 0) {
        resultadoDiv.innerHTML = "<p>Nenhum livro encontrado</p>";
        return;
    }

    livros.forEach(livro => {

        resultadoDiv.innerHTML += `
            <p>
                <strong>${livro.titulo}</strong><br>
                Autor: ${livro.autor}<br>
                Categoria: ${livro.categoria}
            </p>
            <hr>
        `;

    });
}