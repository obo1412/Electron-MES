/**
 * This file will automatically be loaded by webpack and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/application-architecture#main-and-renderer-processes
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.js` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

import "./index.css";

// 전역변수
const contentTable = document.getElementById("content__table");

const createNewTd = (width, value) => {
  const new_td = document.createElement("td");
  if (width != 0) {
    new_td.setAttribute("class", `w-[${width}px]`);
  }
  new_td.innerHTML = value;
  return new_td;
};

// 미사용 샘플코드
// document.getElementById("requestBtn").addEventListener("click", () => {
//   window.api.sendRequest();
// });

// window.api.onResponse((data) => {
//   document.getElementById("response").innerText = data.message;
// });
// 미사용 샘플코드

// 데이터 불러오기
// document.getElementById("btnGetData").addEventListener("click", async () => {
//   const result = await window.api.getData();
//   console.log(result);
// });

// document.getElementById("btnInsertData").addEventListener("click", () => {
//   let inputInsertData = document.getElementById("inputInsertData").value;
//   if (inputInsertData.trim() === "" || inputInsertData === null) {
//     return alert("데이터 없음");
//   }
//   // 현재 테이블 값에 데이터를 올리기 위한 임시 변수 공간.
//   window.api.insertData(inputInsertData);
//   document.getElementById("inputInsertData").value = "";
// });

window.addEventListener("load", async () => {
  // DB에서 데이터 값 호출하기
  const result = await window.api.getAllData();
  // 데이터가 들어갈 태그 호출
  for (const data of result) {
    const new_tr = document.createElement("tr");
    new_tr.classList.add("flex");
    const new_td_id = createNewTd(60, data.id);
    const new_td_regDate = createNewTd(180, data.reg_date);
    const new_td_content = createNewTd(0, data.content);

    new_tr.append(new_td_id);
    new_tr.append(new_td_regDate);
    new_tr.append(new_td_content);
    contentTable.append(new_tr);
  }
});

// DB insert 후 결과값 받기
window.api.receivedDataFromPLC((data) => {
  // data 0 이면 입력 안됨. 1 이상이면 입력됨.
  // let regDate = new Date();
  // regDate = utils.timeFormmatter(regDate);

  if (data.id !== null || data.id !== 0) {
    const new_tr = document.createElement("tr");
    const new_td_id = createNewTd(60, data.id);
    const new_td_regDate = createNewTd(180, data.reg_date);
    const new_td_content = createNewTd(0, data.content);

    new_tr.append(new_td_id);
    new_tr.append(new_td_regDate);
    new_tr.append(new_td_content);
    contentTable.append(new_tr);
  }
});
