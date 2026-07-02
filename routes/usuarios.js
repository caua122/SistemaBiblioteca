const express = require("express");
const router = express.Router();

let usuarios = [];

// LISTAR
router.get("/", (req, res) => {
    res.json(usuarios);
});

// CRIAR
router.post("/", (req, res) => {

    const { nome, email, tipo } = req.body;

    const usuario = {
        id: Date.now(),
        nome,
        email,
        tipo
    };

    usuarios.push(usuario);

    res.json({
        mensagem: "Usuário criado com sucesso!",
        usuario
    });

});

// ATUALIZAR
router.put("/:id", (req, res) => {

    const id = Number(req.params.id);
    const { nome, email, tipo } = req.body;

    const user = usuarios.find(u => u.id === id);

    if (!user) {
        return res.status(404).json({
            mensagem: "Usuário não encontrado"
        });
    }

    user.nome = nome;
    user.email = email;
    user.tipo = tipo;

    res.json({
        mensagem: "Usuário atualizado com sucesso!",
        user
    });

});

// EXCLUIR
router.delete("/:id", (req, res) => {

    const id = Number(req.params.id);

    usuarios = usuarios.filter(u => u.id !== id);

    res.json({
        mensagem: "Usuário removido com sucesso!"
    });

});

module.exports = router;