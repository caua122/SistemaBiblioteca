const express = require("express");
const router = express.Router();

let emprestimos = [];

// LISTAR
router.get("/", (req, res) => {
    res.json(emprestimos);
});

// CRIAR EMPRÉSTIMO
router.post("/", (req, res) => {

    const { usuario, livro } = req.body;

    const emprestimo = {
        id: Date.now(),
        usuario,
        livro,
        dataEmprestimo: new Date().toLocaleDateString(),
        status: "Ativo"
    };

    emprestimos.push(emprestimo);

    res.json({
        mensagem: "Empréstimo realizado com sucesso!",
        emprestimo
    });
});

// DEVOLVER LIVRO
router.put("/devolver/:id", (req, res) => {

    const id = Number(req.params.id);

    const emprestimo = emprestimos.find(e => e.id === id);

    if (!emprestimo) {
        return res.status(404).json({
            mensagem: "Empréstimo não encontrado"
        });
    }

    emprestimo.status = "Devolvido";
    emprestimo.dataDevolucao = new Date().toLocaleDateString();

    res.json({
        mensagem: "Livro devolvido com sucesso!",
        emprestimo
    });
});

// EXCLUIR (opcional)
router.delete("/:id", (req, res) => {

    const id = Number(req.params.id);

    emprestimos = emprestimos.filter(e => e.id !== id);

    res.json({
        mensagem: "Empréstimo removido"
    });
});

module.exports = router;