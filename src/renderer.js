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

// 미사용 샘플코드
// document.getElementById("requestBtn").addEventListener("click", () => {
//   window.api.sendRequest();
// });

// window.api.onResponse((data) => {
//   document.getElementById("response").innerText = data.message;
// });
// 미사용 샘플코드

document.getElementById("btnGetData").addEventListener("click", async () => {
  const result = await window.api.getData();

  console.log(result);
});

document.getElementById("btnInsertData").addEventListener("click", () => {
  let inputInsertData = document.getElementById("inputInsertData").value;
  window.api.insertData(inputInsertData);
  document.getElementById("inputInsertData").value = "";
});
