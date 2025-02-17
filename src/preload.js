// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { data } = require("autoprefixer");
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  sendRequest: () => ipcRenderer.send("request-data"),
  onResponse: (callback) =>
    ipcRenderer.on("response-data", (event, data) => callback(data)),
  getData: () => ipcRenderer.invoke("get-data"),
  insertData: (params) => ipcRenderer.send("insert-data", params),
  insertResult: (callback) =>
    ipcRenderer.on("insert-result", (event, data) => callback(data)),
});
