const express = require("express");
const router = express.Router();

let mensagens = [];

// LISTAR mensagens (opcional)
router.get("/", (req, res) => {
    res.json(mensagens);
});

// ENVIAR mensagem
router.post("/", (req, res) => {

    const { nome, email, mensagem } = req.body;

    const contato = {
        id: Date.now(),
        nome,
        email,
        mensagem,
        data: new Date().toLocaleDateString()
    };

    mensagens.push(contato);

    res.json({
        mensagem: "Mensagem enviada com sucesso!",
        contato
    });
});

module.exports = router;