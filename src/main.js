import { app, BrowserWindow, ipcMain, webContents } from "electron";
import started from "electron-squirrel-startup";
// Socket 통신을 위한 라이브러리 net
const net = require("net");
// import path from "node:path";
const sqlite3 = require("sqlite3").verbose();
let db;
let mainWindow;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
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

// 미사용 샘플 코드
ipcMain.on("request-data", (event) => {
  const data = { message: "Hello from main process!" };
  event.reply("response-data", data); // 데이터 전송
});
// 미사용 샘플 코드

// 데이터베이스 초기화
function initializeDatabase() {
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

// get-data DB 통신 함수
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

// get-data 요청 처리
ipcMain.handle("get-data", (event) => {
  return new Promise((resolve) => {
    getData(resolve);
  });
});

// insert-data DB 통신 함수
function addData(params) {
  const query = `INSERT INTO datalog ( content ) VALUES ( ? )`;
  return new Promise((resolve, reject) => {
    db.run(query, [params], function (err) {
      if (err) {
        reject(console.log(err.message));
      }
      resolve([this.changes, this.lastID]);
    });
  });
}

// insert-data 요청 처리 Renderer에서 insert-data 신호를 받아야 동작함.
ipcMain.on("insert-data", async (event, params) => {
  const insertResult = await addData(params);
  event.sender.send("insert-result", insertResult);
});

/*
  PLC와 Socket 통신
*/
const server = net.createServer((socket) => {
  socket.on("data", async (data) => {
    // console.log("받은 데이터: " + data.toString());
    const receivedDataFromPLC = await addData(data);
    // 저장된 데이터 불러와서 메인화면으로 뿌려주기 처리 수정해야함.
    mainWindow.webContents.send("received-data-from-plc", receivedDataFromPLC);
  });

  socket.on("end", () => {
    console.log("연결 끊김.");
  });

  socket.on("error", (err) => {
    console.error("Socket 오류: ", err);
  });
});

const socketPORT = 9600; //소켓 포트 번호
server.listen(socketPORT, () => {
  console.log(`서버가 포트 ${socketPORT}에서 대기중입니다.`);
});
