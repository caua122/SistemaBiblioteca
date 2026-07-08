const express = require("express");
const router = express.Router();
const { pool } = require("../config/db");

// LISTAR (já traz o nome do usuário e o título do livro, via JOIN)
router.get("/", async (req, res) => {
    try {
        const [emprestimos] = await pool.query(`
            SELECT e.id, e.usuario_id, u.nome AS usuario, e.livro_id, l.titulo AS livro,
                   e.data_emprestimo, e.data_devolucao, e.status
            FROM emprestimos e
            JOIN usuarios u ON u.id = e.usuario_id
            JOIN livros l ON l.id = e.livro_id
            ORDER BY e.id DESC
        `);
        res.json(emprestimos);
    } catch (err) {
        res.status(500).json({ mensagem: "Erro ao buscar empréstimos.", erro: err.message });
    }
});

// CRIAR EMPRÉSTIMO
// Espera receber usuario_id e livro_id no corpo da requisição
router.post("/", async (req, res) => {
    try {
        const { usuario_id, livro_id } = req.body;

        const [resultado] = await pool.query(
            `INSERT INTO emprestimos (usuario_id, livro_id, data_emprestimo, status)
             VALUES (?, ?, CURDATE(), 'Ativo')`,
            [usuario_id, livro_id]
        );

        res.json({
            mensagem: "Empréstimo realizado com sucesso!",
            emprestimo: { id: resultado.insertId, usuario_id, livro_id, status: "Ativo" }
        });
    } catch (err) {
        res.status(500).json({ mensagem: "Erro ao registrar empréstimo.", erro: err.message });
    }
});

// DEVOLVER LIVRO
router.put("/devolver/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        const [resultado] = await pool.query(
            `UPDATE emprestimos
             SET status = 'Devolvido', data_devolucao = CURDATE()
             WHERE id = ?`,
            [id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ mensagem: "Empréstimo não encontrado" });
        }

        res.json({ mensagem: "Livro devolvido com sucesso!" });
    } catch (err) {
        res.status(500).json({ mensagem: "Erro ao devolver livro.", erro: err.message });
    }
});

// EXCLUIR (opcional)
router.delete("/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        await pool.query("DELETE FROM emprestimos WHERE id = ?", [id]);

        res.json({ mensagem: "Empréstimo removido" });
    } catch (err) {
        res.status(500).json({ mensagem: "Erro ao remover empréstimo.", erro: err.message });
    }
});

module.exports = router;
