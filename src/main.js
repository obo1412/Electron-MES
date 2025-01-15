import { app, BrowserWindow, ipcMain } from "electron";
import started from "electron-squirrel-startup";
import path from "node:path";
const sqlite3 = require("sqlite3").verbose();

let db;

// 데이터베이스 초기화
function initializeDatabase() {
  db = new sqlite3.Database("./database.db", (err) => {
    if (err) {
      console.error("데이터베이스 연결 오류", err.message);
    } else {
      console.log("데이터베이스에 연결되었습니다.");
    }
  });

  db.run(`CREATE TABLE IF NOT EXISTS datalog
    (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      content TEXT NOT NULL
    )`);
}

function getData(res) {
  const query = `SELECT * FROM datalog`;
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error("사용자 조회 오류:", err.message);
      res([]);
    } else {
      res(rows);
    }
  });
}

ipcMain.handle("get-data", (event) => {
  // 요청 처리
  return new Promise((resolve) => {
    getData(resolve);
  });
});

ipcMain.handle("insert-data", (event) => {
  console.log("insert data received");
  db.run(`INSERT INTO datalog ( content ) VALUES ( 'DDFDFDFDF' )`, (err) => {
    if (err) {
      return console.log(err.message);
    } else {
      console.log("A row has been inserted");
    }
  });
});

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  initializeDatabase();
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (db) {
    db.close((err) => {
      if (err) {
        console.error("데이터베이스 종료 오류:", err.message);
      }
    });
  }

  if (process.platform !== "darwin") {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

ipcMain.on("request-data", (event) => {
  const data = { message: "Hello from main process!" };
  event.reply("response-data", data); // 데이터 전송
});
