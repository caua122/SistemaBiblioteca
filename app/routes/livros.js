const express = require("express");
const router = express.Router();
const { pool } = require("../config/db");

// LISTAR (READ)
router.get("/", async (req, res) => {
    try {
        const [livros] = await pool.query("SELECT * FROM livros ORDER BY id DESC");
        res.json(livros);
    } catch (err) {
        res.status(500).json({ mensagem: "Erro ao buscar livros.", erro: err.message });
    }
});

// CRIAR (CREATE)
router.post("/", async (req, res) => {
    try {
        const { titulo, autor, categoria } = req.body;

        const [resultado] = await pool.query(
            "INSERT INTO livros (titulo, autor, categoria) VALUES (?, ?, ?)",
            [titulo, autor, categoria]
        );

        res.json({
            mensagem: "Livro cadastrado com sucesso!",
            livro: { id: resultado.insertId, titulo, autor, categoria }
        });
    } catch (err) {
        res.status(500).json({ mensagem: "Erro ao cadastrar livro.", erro: err.message });
    }
});

// ATUALIZAR (UPDATE)
router.put("/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { titulo, autor, categoria } = req.body;

        const [resultado] = await pool.query(
            "UPDATE livros SET titulo = ?, autor = ?, categoria = ? WHERE id = ?",
            [titulo, autor, categoria, id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ mensagem: "Livro não encontrado." });
        }

        res.json({
            mensagem: "Livro atualizado com sucesso!",
            livro: { id, titulo, autor, categoria }
        });
    } catch (err) {
        res.status(500).json({ mensagem: "Erro ao atualizar livro.", erro: err.message });
    }
});

// EXCLUIR (DELETE)
router.delete("/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        await pool.query("DELETE FROM livros WHERE id = ?", [id]);

        res.json({ mensagem: "Livro removido com sucesso!" });
    } catch (err) {
        res.status(500).json({ mensagem: "Erro ao remover livro.", erro: err.message });
    }
});

// BUSCAR
router.get("/buscar/:termo", async (req, res) => {
    try {
        const termo = `%${req.params.termo.toLowerCase()}%`;

        const [resultado] = await pool.query(
            `SELECT * FROM livros
             WHERE LOWER(titulo) LIKE ?
                OR LOWER(autor) LIKE ?
                OR LOWER(categoria) LIKE ?`,
            [termo, termo, termo]
        );

        res.json(resultado);
    } catch (err) {
        res.status(500).json({ mensagem: "Erro ao buscar livros.", erro: err.message });
    }
});

module.exports = router;
