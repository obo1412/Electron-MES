// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  sendRequest: () => ipcRenderer.send("request-data"),
  onResponse: (callback) =>
    ipcRenderer.on("response-data", (event, data) => callback(data)),
  getData: () => ipcRenderer.invoke("get-data"),
  insertData: () => ipcRenderer.invoke("insert-data"),
});
