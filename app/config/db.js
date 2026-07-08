const mysql = require("mysql2/promise");
require("dotenv").config();

// Pool de conexões: reaproveita conexões em vez de abrir uma nova a cada
// requisição. É o jeito recomendado de usar MySQL em uma aplicação Node.js.
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Testa a conexão assim que o servidor sobe, pra já avisar se algo
// estiver errado nas credenciais/host em vez de falhar silenciosamente
// só quando alguém acessar uma rota.
async function testarConexao() {
    try {
        const conn = await pool.getConnection();
        console.log("✅ Conectado ao banco MySQL com sucesso!");
        conn.release();
    } catch (err) {
        console.error("❌ Erro ao conectar ao banco MySQL:", err.message);
    }
}

module.exports = { pool, testarConexao };
