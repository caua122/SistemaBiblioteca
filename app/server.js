const express = require("express");
const path = require("path");
const { testarConexao } = require("./config/db");

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));
const usuariosRoutes = require("./routes/usuarios");
app.use("/api/usuarios", usuariosRoutes);
const emprestimosRoutes = require("./routes/emprestimos");
app.use("/api/emprestimos", emprestimosRoutes);
const livrosRoutes = require("./routes/livros");
app.use("/api/livros", livrosRoutes);
const contatoRoutes = require("./routes/contato");
app.use("/api/contato", contatoRoutes);
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "login.html"));
});

app.listen(PORT, async () => {
    console.log(`Servidor iniciado em http://localhost:${PORT}`);
    await testarConexao();
});