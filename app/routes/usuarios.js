const express = require("express");
const router = express.Router();
const { pool } = require("../config/db");

// LISTAR
router.get("/", async (req, res) => {
    try {
        const [usuarios] = await pool.query("SELECT * FROM usuarios ORDER BY id DESC");
        res.json(usuarios);
    } catch (err) {
        res.status(500).json({ mensagem: "Erro ao buscar usuários.", erro: err.message });
    }
});

// CRIAR
router.post("/", async (req, res) => {
    try {
        const { nome, email, tipo } = req.body;

        const [resultado] = await pool.query(
            "INSERT INTO usuarios (nome, email, tipo) VALUES (?, ?, ?)",
            [nome, email, tipo]
        );

        res.json({
            mensagem: "Usuário criado com sucesso!",
            usuario: { id: resultado.insertId, nome, email, tipo }
        });
    } catch (err) {
        // ER_DUP_ENTRY acontece se o email já estiver cadastrado (é UNIQUE no schema)
        if (err.code === "ER_DUP_ENTRY") {
            return res.status(409).json({ mensagem: "Já existe um usuário com esse email." });
        }
        res.status(500).json({ mensagem: "Erro ao criar usuário.", erro: err.message });
    }
});

// ATUALIZAR
router.put("/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { nome, email, tipo } = req.body;

        const [resultado] = await pool.query(
            "UPDATE usuarios SET nome = ?, email = ?, tipo = ? WHERE id = ?",
            [nome, email, tipo, id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ mensagem: "Usuário não encontrado" });
        }

        res.json({
            mensagem: "Usuário atualizado com sucesso!",
            user: { id, nome, email, tipo }
        });
    } catch (err) {
        res.status(500).json({ mensagem: "Erro ao atualizar usuário.", erro: err.message });
    }
});

// EXCLUIR
router.delete("/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        await pool.query("DELETE FROM usuarios WHERE id = ?", [id]);

        res.json({ mensagem: "Usuário removido com sucesso!" });
    } catch (err) {
        res.status(500).json({ mensagem: "Erro ao remover usuário.", erro: err.message });
    }
});

module.exports = router;
