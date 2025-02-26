const sqlite3 = require("sqlite3").verbose();

export let db;

// 데이터베이스 초기화
export function initializeDatabase() {
  db = new sqlite3.Database("./database.db", (err) => {
    if (err) {
      console.error("데이터베이스 연결 오류", err.message);
    }
  });

  db.run(`CREATE TABLE IF NOT EXISTS datalog
      (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        reg_date TIMESTAMP DEFAULT (DATETIME('now', 'localtime')),
        content TEXT NOT NULL
      )`);
}
