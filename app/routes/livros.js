const express = require("express");
const router = express.Router();

let livros = [];

// LISTAR (READ)
router.get("/", (req, res) => {
    res.json(livros);
});


// CRIAR (CREATE)
router.post("/", (req, res) => {

    const { titulo, autor, categoria } = req.body;

    const livro = {
        id: Date.now(),
        titulo,
        autor,
        categoria
    };

    livros.push(livro);

    res.json({
        mensagem: "Livro cadastrado com sucesso!",
        livro
    });

});


// ATUALIZAR (UPDATE)
router.put("/:id", (req, res) => {

    const id = Number(req.params.id);
    const { titulo, autor, categoria } = req.body;

    const livro = livros.find(l => l.id === id);

    if (!livro) {
        return res.status(404).json({
            mensagem: "Livro não encontrado."
        });
    }

    livro.titulo = titulo;
    livro.autor = autor;
    livro.categoria = categoria;

    res.json({
        mensagem: "Livro atualizado com sucesso!",
        livro
    });

});


// EXCLUIR (DELETE)
router.delete("/:id", (req, res) => {

    const id = Number(req.params.id);

    livros = livros.filter(livro => livro.id !== id);

    res.json({
        mensagem: "Livro removido com sucesso!"
    });

});

router.get("/buscar/:termo", (req, res) => {

    const termo = req.params.termo.toLowerCase();

    const resultado = livros.filter(livro =>
        livro.titulo.toLowerCase().includes(termo) ||
        livro.autor.toLowerCase().includes(termo) ||
        livro.categoria.toLowerCase().includes(termo)
    );

    res.json(resultado);
});

module.exports = router;