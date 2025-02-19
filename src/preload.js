// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  sendRequest: () => ipcRenderer.send("request-data"),
  onResponse: (callback) =>
    ipcRenderer.on("response-data", (event, data) => callback(data)),
  initWindow: (callback) =>
    ipcRenderer.on("init-window", (event, data) => callback(data)),
  refreshWindow: () => ipcRenderer.invoke("get-all-data"),
  getOneData: () => ipcRenderer.invoke("get-one-data"),
  insertData: (params) => ipcRenderer.send("insert-data", params),
  insertResult: (callback) =>
    ipcRenderer.on("insert-result", (event, data) => callback(data)),
  receivedDataFromPLC: (callback) =>
    ipcRenderer.on("received-data-from-plc", (event, data) => callback(data)),
  exportDataToExcel: () => ipcRenderer.invoke("export-data-to-excel"),
});
